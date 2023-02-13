import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { addDays, endOfDay, format, isWithinInterval, sub } from 'date-fns';
import { catchError, take, tap } from 'rxjs';
import { Habit } from 'src/app/shared/models/habit';
import { DailyHabitRecordState } from 'src/app/store/daily-record.state';
import { ArchiveHabit, DeleteHabit } from 'src/app/store/habit.action';
import { HabitState } from 'src/app/store/habit.state';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { HabitEditComponent } from '../habit-edit/habit-edit.component';
import { DailyHabitRecord } from 'src/app/shared/models/daily-habit-record';
import { DailyRecordFunctions } from 'src/app/shared/utility/dailyRecords';
interface Streak {
  streak: number;
  startDate?: Date;
  endDate?: Date;
}

@Component({
  selector: 'app-habit-detail',
  templateUrl: './habit-detail.component.html',
  styleUrls: ['./habit-detail.component.scss'],
})
export class HabitDetailComponent implements OnInit {
  public habitData?: Habit;
  public dailyRecords?: DailyHabitRecord[];
  public currentArchiveStatus: string = '';
  public isArchived!: boolean;
  public numOfCompletion: number = 0;
  public currentStreak: Streak = { streak: 0, startDate: new Date() };
  public bestStreak: Streak = { streak: 0, startDate: new Date() };
  public currentScore: number = 0;
  public avgScore: number = 100;
  public streaks: Streak[] = [];
  public dateFormat: string = 'MMMM d, y';

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<HabitDetailComponent>,
    private dailyRecordFunctions: DailyRecordFunctions,
    @Inject(MAT_DIALOG_DATA) public habitId: string // value passed from Mat-dialog
  ) {}

  ngOnInit(): void {
    this.habitData = this.store.selectSnapshot(HabitState.getHabitbyId)(
      this.habitId
    );
    this.dailyRecords = this.store
      .selectSnapshot(DailyHabitRecordState.dailyCompletionStatus)
      ?.filter((record) => record.habitId === this.habitId);

    this.findnumOfCompletion();
    this.calculateStreaks();
    this.bestStreak = this.findBestStreak();
    this.currentStreak = this.findCurrentStreak();
    this.currentScore = this.calculateGoalMet();
    this.avgScore = this.calculateAvgScore();
  }

  onClickArchive(): void {
    const currentStatus = this.store.selectSnapshot(HabitState.getHabitbyId)(
      this.habitId
    )?.archiveStatus;
    if (currentStatus == false) {
      this.isArchived = true;
    } else {
      this.isArchived = false;
    }
    this.store
      .dispatch(new ArchiveHabit(this.isArchived, this.habitId))
      .pipe(
        take(1),
        tap(() => {
          window.alert('This habit has been archived');
          this.dialogRef.close();
        }),
        catchError((err) => {
          throw alert(err.message);
        })
      )
      .subscribe(() => window.location.reload());
  }
  onEdit(id: string) {
    this.dialog.open(HabitEditComponent, {
      width: '50%',
      height: '55%',
      data: id,
    });
  }
  onDelete() {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      const habitsList = this.store.selectSnapshot(HabitState.habitsList);
      const result = habitsList!.find((mood) => mood.id === this.habitId);
      this.store
        .dispatch(new DeleteHabit(result?.id!))
        .pipe(
          take(1),
          tap(() => this.dialogRef.close()),
          catchError((err) => {
            throw alert(err.message);
          })
        )
        .subscribe(() => window.location.reload());
      return true;
    } else {
      return false;
    }
  }

  public findnumOfCompletion() {
    if (this.dailyRecords) {
      const uniqueDates = [
        ...new Set(this.dailyRecords.map((record) => record.date)),
      ];
      const dateCounts = uniqueDates.map(
        (date) =>
          this.dailyRecords!.filter((record) => record.date === date).length
      );
      if (this.habitData?.frequency && this.habitData.frequency === 'Day') {
        this.numOfCompletion = dateCounts.filter(
          // if frq = day, count dates when user met the goal (1x day, 3x day etc)
          (num) => num >= this.habitData!.countPerFreq
        ).length;
      } else {
        this.numOfCompletion = dateCounts.length;
      }
    } else {
      this.numOfCompletion = 0;
    }
  }

  public calculateStreaks(): void {
    const frequency = this.habitData!.frequency;
    const records = this.store
      .selectSnapshot(DailyHabitRecordState.dailyCompletionStatus)
      ?.filter((record) => record.habitId === this.habitData?.id);
    if (records && records?.length === 0) {
      return;
    } else if (records) {
      const startDate = this.dailyRecordFunctions.findBeginningofInterval(
        frequency,
        new Date(records[0].date)
      );
      const endDate = endOfDay(new Date());
      const maxStreaks =
        this.dailyRecordFunctions.maxStreaks(frequency, endDate, startDate) ===
        0
          ? 1
          : this.dailyRecordFunctions.maxStreaks(frequency, endDate, startDate);
      let streakCount = 0;
      let currentStartInterval = startDate;
      for (let i = 0; i < maxStreaks; i++) {
        let nextStartOfInterval = addDays(
          currentStartInterval,
          this.dailyRecordFunctions.delta(frequency, currentStartInterval)
        );
        let endofInterval = sub(nextStartOfInterval, { seconds: 1 });

        let recordsFound = records.filter((item) =>
          isWithinInterval(new Date(item.date), {
            start: currentStartInterval,
            end: endofInterval,
          })
        );
        let streaksToCount = streakCount;
        if (recordsFound.length >= this.habitData!.countPerFreq) {
          ////// Goal Met
          streakCount += 1;
          if (i === maxStreaks - 1) {
            if (
              recordsFound[recordsFound.length - 1] &&
              recordsFound[recordsFound.length - 1].date <=
                format(new Date(), 'yyyy/MM/dd')
            ) {
              streaksToCount = streakCount - 1;
            }

            this.streaks.push({
              streak: streakCount,
              startDate: this.dailyRecordFunctions.findStartDateofCurrentStreak(
                frequency,
                currentStartInterval,
                streaksToCount
              ),
              endDate: this.dailyRecordFunctions.findEndDateofCurrentInterval(
                frequency,
                currentStartInterval
              ),
            });
          }
        } else {
          ////// Goal NOT Met = Reset current streak to 0
          if (streakCount !== 0) {
            // Push non-zero value before reset
            this.streaks.push({
              streak: streakCount,
              startDate: this.dailyRecordFunctions.findStartDateofCurrentStreak(
                frequency,
                currentStartInterval,
                streaksToCount
              ),
              endDate: this.dailyRecordFunctions.findEndDateofCurrentStreak(
                frequency,
                currentStartInterval,
                streaksToCount
              ),
            });
            streakCount = 0;

            //push one more time for 0 value of current interval (so it does not skip a cycle)
            this.streaks.push({
              streak: streakCount,
              startDate: currentStartInterval,
              endDate: this.dailyRecordFunctions.findEndDateofCurrentInterval(
                frequency,
                currentStartInterval
              ),
            });
          } else {
            // push zero value if 0 streak continues
            this.streaks.push({
              streak: streakCount,
              startDate: this.dailyRecordFunctions.findStartDateofCurrentStreak(
                frequency,
                currentStartInterval,
                streaksToCount
              ),
              endDate: this.dailyRecordFunctions.findEndDateofCurrentInterval(
                frequency,
                currentStartInterval
              ),
            });
          }
        }
        currentStartInterval = nextStartOfInterval;
      }
    }
  }
  private findCurrentStreak() {
    let currentStreak = this.streaks[this.streaks.length - 1] || {
      streak: 0,
      startDate: new Date(),
    };
    return currentStreak;
  }
  private findBestStreak() {
    const largest = Math.max(...this.streaks.map((x) => x.streak));
    const bestStreak = this.streaks.find(
      (record) => record.streak === largest
    ) || { streak: 0, startDate: new Date() };
    return bestStreak;
  }

  private calculateGoalMet() {
    const frequency = this.habitData!.frequency;
    const startDate = this.dailyRecordFunctions.findBeginningofInterval(
      frequency,
      new Date()
    );
    const endDate = this.dailyRecordFunctions.findEndDateofCurrentInterval(
      frequency,
      startDate
    );
    const findTrueCount = this.store
      .selectSnapshot(DailyHabitRecordState.dailyCompletionStatus)!
      .filter(
        (record) =>
          record.habitId === this.habitId &&
          record.date <= format(endDate, 'yyyy/MM/dd') &&
          record.date >= format(startDate, 'yyyy/MM/dd') //date range (daily: 00:00 ~ 23:59 / weekly mon~sun / monthly 1st ~ 31)
      );
    const result = (findTrueCount.length / this.habitData?.countPerFreq!) * 100;
    if (result >= 100) {
      return 100;
    }
    return result;
  }

  public calculateAvgScore() {
    const frequency = this.habitData!.frequency;
    if (this.streaks) {
      const startDate = this.dailyRecordFunctions.findBeginningofInterval(
        frequency,
        new Date(this.habitData!.createdOn)
      );
      const endDate = this.dailyRecordFunctions.findEndDateofCurrentInterval(
        frequency,
        new Date()
      );
      const maxStreaks = this.dailyRecordFunctions.maxStreaks(
        frequency,
        endDate,
        startDate
      );
      const totalStreaksEarned = Object.values(this.streaks).reduce(
        (s, { streak }) => s + streak,
        0
      );
      const result = Math.trunc((totalStreaksEarned / maxStreaks) * 100);
      return result >= 100 ? (this.avgScore = 100) : (this.avgScore = result);
    }
    return (this.avgScore = 0);
  }
}
