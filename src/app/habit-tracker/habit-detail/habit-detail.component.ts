import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  addDays,
  addMonths,
  addWeeks,
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  getDaysInMonth,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
  sub,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';
import { catchError, take, tap } from 'rxjs';
import { Habit } from 'src/app/shared/models/habit';
import { DailyHabitRecordState } from 'src/app/store/daily-record.state';
import { ArchiveHabit, DeleteHabit } from 'src/app/store/habit.action';
import { HabitState } from 'src/app/store/habit.state';
import { Freqeuncy } from '../enums/frequency';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { HabitEditComponent } from '../habit-edit/habit-edit.component';
import { DailyHabitRecord } from 'src/app/shared/models/daily-habit-record';
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
  public bestStreak: number = 0;
  public currentScore: number = 0;
  public avgScore: number = 100;
  public streaks: Streak[] = [];
  public dateFormat: string = 'MMMM d, y';

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<HabitDetailComponent>,
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
    let delta: (date: Date) => number;
    let startDateFunction: (date: Date) => Date;
    let maxStreaksFunction: (startDate: Date, endDate: Date) => number;
    let findStartDateofStreaksFunction: (date: Date, streak: number) => Date;
    let findEndDateofStreaksFunction: (date: Date, streak: number) => Date;
    switch (this.habitData?.frequency) {
      case Freqeuncy.Day:
        delta = (date: Date) => {
          return 1;
        };
        startDateFunction = (date: Date) => {
          return startOfDay(date);
        };
        maxStreaksFunction = (endDate: Date, startDate: Date) => {
          return differenceInDays(addDays(endDate, 1), startDate);
        };
        findStartDateofStreaksFunction = (date: Date, streak: number) => {
          return subDays(date, streak);
        };
        findEndDateofStreaksFunction = (date: Date, streak: number) => {
          let startDate = findStartDateofStreaksFunction(date, streak);
          console.log(startDate, streak);
          return addDays(startDate, streak); // pass startDate?
        };
        break;
      case Freqeuncy.Week:
        delta = (date: Date) => {
          return 7;
        };
        startDateFunction = (date: Date) => {
          return startOfWeek(date, { weekStartsOn: 1 });
        };
        maxStreaksFunction = (endDate: Date, startDate: Date) => {
          const endDateOfCurrentWeek = endOfWeek(endDate, { weekStartsOn: 1 });
          return differenceInWeeks(endDateOfCurrentWeek, startDate, {
            roundingMethod: 'ceil',
          });
        };
        findStartDateofStreaksFunction = (date: Date, streak: number) => {
          return subWeeks(date, streak);
        };
        findEndDateofStreaksFunction = (date: Date, streak: number) => {
          let startDate = findStartDateofStreaksFunction(date, streak);
          return endOfWeek(addWeeks(startDate, streak), {
            weekStartsOn: 1,
          }); // pass startDate?
        };
        break;
      case Freqeuncy.Month:
        delta = (date: Date) => {
          return getDaysInMonth(date);
        };
        startDateFunction = (date: Date) => {
          return startOfMonth(date);
        };
        maxStreaksFunction = (endDate: Date, startDate: Date) => {
          let startOfNextMonth = startOfMonth(addMonths(endDate, 1)); // endDate of diffInMonth does not include endDate
          return differenceInMonths(startOfNextMonth, startDate);
        };
        findStartDateofStreaksFunction = (date: Date, streak: number) => {
          return subMonths(date, streak);
        };
        findEndDateofStreaksFunction = (date: Date, streak: number) => {
          let startDate = endOfMonth(
            findStartDateofStreaksFunction(date, streak)
          );
          return addMonths(startDate, streak); // pass startDate?
        };
        break;
      default:
        return;
    }

    const records = this.store
      .selectSnapshot(DailyHabitRecordState.dailyCompletionStatus)
      ?.filter((record) => record.habitId === this.habitData?.id);
    if (records && records?.length === 0) {
      return;
    } else if (records) {
      const startDate = startDateFunction(new Date(records[0].date));
      const endDate = endOfDay(new Date());
      const maxStreaks =
        maxStreaksFunction(endDate, startDate) === 0
          ? 1
          : maxStreaksFunction(endDate, startDate);
      let currentStreak = 0;
      let currentStartInterval = startDate; // startDate is fixed, intervalStart is not

      for (let i = 0; i < maxStreaks; i++) {
        let nextStartOfInterval = addDays(
          currentStartInterval,
          delta(currentStartInterval)
        );
        let endofInterval = sub(nextStartOfInterval, { seconds: 1 });

        let recordsFound = records.filter((item) =>
          isWithinInterval(new Date(item.date), {
            start: currentStartInterval,
            end: endofInterval,
          })
        );
        let streaksToCount = currentStreak;
        if (recordsFound.length >= this.habitData.countPerFreq) {
          ////// Goal Met
          currentStreak += 1;
          if (i === maxStreaks - 1) {
            if (
              recordsFound[length - 1] &&
              recordsFound[length - 1].date <= format(new Date(), 'yyyy/MM/dd')
            ) {
              console.log(recordsFound);
              streaksToCount = currentStreak - 1;
            }
            this.streaks.push({
              streak: currentStreak,
              startDate: findStartDateofStreaksFunction(
                currentStartInterval, //date
                streaksToCount // - streak
              ),
              endDate: findEndDateofStreaksFunction(
                currentStartInterval, //date
                streaksToCount // - streak
              ),
            });
          }
        } else {
          ////// Goal NOT Met = Reset current streak to 0
          this.streaks.push({
            streak: currentStreak, //2
            startDate: findStartDateofStreaksFunction(
              currentStartInterval,
              streaksToCount
            ),
            endDate: findEndDateofStreaksFunction(
              currentStartInterval, //date
              streaksToCount // - streak
            ),
          });
          currentStreak = 0;
        }
        currentStartInterval = nextStartOfInterval;
      }
      console.log(this.streaks);
    }
  }
  private findCurrentStreak() {
    let currentStreak = this.streaks[this.streaks.length - 1];
    return currentStreak;
  }
  private findBestStreak() {
    let bestStreak = Math.max(...this.streaks.map((x) => x.streak));
    return bestStreak;
  }

  private calculateGoalMet() {
    let startDateFunction: (date: Date) => Date;
    let endDateFunction: (date: Date) => Date;
    switch (this.habitData?.frequency) {
      case Freqeuncy.Day:
        startDateFunction = (date: Date) => {
          return startOfDay(date);
        };
        endDateFunction = (date: Date) => {
          return endOfDay(date);
        };
        break;
      case Freqeuncy.Week:
        startDateFunction = (date: Date) => {
          return startOfWeek(date, { weekStartsOn: 1 });
        };
        endDateFunction = (date: Date) => {
          return endOfWeek(date, { weekStartsOn: 1 });
        };
        break;
      case Freqeuncy.Month:
        startDateFunction = (date: Date) => {
          return startOfMonth(date);
        };
        endDateFunction = (date: Date) => {
          return endOfMonth(date);
        };
        break;
      default:
        return 0;
    }
    let startDate = startDateFunction(new Date());
    let endDate = endDateFunction(startDate);
    let findTrueCount = this.store
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
    let startDateFunction: (date: Date) => Date;
    let endDateFunction: (date: Date) => Date;
    let maxStreaksFunction: (endDate: Date, startDate: Date) => number;
    switch (this.habitData?.frequency) {
      case Freqeuncy.Day:
        startDateFunction = (date: Date) => {
          return startOfDay(date);
        };
        endDateFunction = (date: Date) => {
          return addDays(endOfDay(date), 1);
        };
        maxStreaksFunction = (endDate: Date, startDate: Date) =>
          differenceInDays(endDate, startDate);
        break;
      case Freqeuncy.Week:
        startDateFunction = (date: Date) => {
          return startOfWeek(date, { weekStartsOn: 1 });
        };
        endDateFunction = (date: Date) => {
          return addDays(endOfWeek(date, { weekStartsOn: 1 }), 1);
        };
        maxStreaksFunction = (endDate: Date, startDate: Date) =>
          differenceInWeeks(endDate, startDate, { roundingMethod: 'ceil' });
        break;
      case Freqeuncy.Month:
        startDateFunction = (date: Date) => {
          return startOfMonth(date);
        };
        endDateFunction = (date: Date) => {
          return addDays(endOfMonth(date), 1);
        };
        maxStreaksFunction = (endDate: Date, startDate: Date) =>
          differenceInMonths(endDate, startDate);
        break;
      default:
        return 0;
    }

    if (this.streaks) {
      const startDate = startDateFunction(new Date(this.habitData.createdOn)); //start date of calculating range
      const endDate = endDateFunction(new Date()); //end date of calculating range
      const maxStreaks = maxStreaksFunction(endDate, startDate);
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
