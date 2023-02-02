import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import {
  addDays,
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
  subDays,
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
interface Streak {
  streak: number;
  startDate: Date;
  endDate?: Date;
}

@Component({
  selector: 'app-habit-detail',
  templateUrl: './habit-detail.component.html',
  styleUrls: ['./habit-detail.component.scss'],
})
export class HabitDetailComponent implements OnInit {
  public habitData?: Habit;
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
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<HabitDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public habitId: string // value passed from Mat-dialog
  ) {}

  ngOnInit(): void {
    this.habitData = this.store.selectSnapshot(HabitState.getHabitbyId)(
      this.habitId
    );

    this.findnumOfCompletion(this.habitId);
    this.calculateStreaks();
    this.bestStreak = this.findBestStreak();
    this.currentStreak = this.findCurrentStreak();
    this.currentScore = this.calculateGoalMet();
    this.avgScore = this.calculateAvgScore();

    console.log(this.streaks);
  }

  onClickArchive(): void {
    // button to patch value inside of the form and dispatch update action
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

  private findnumOfCompletion(habitId: string) {
    const count: number =
      this.store
        .selectSnapshot(DailyHabitRecordState.dailyCompletionStatus)
        ?.filter(
          (record) =>
            record.habitId === habitId &&
            new Date(record.date) <= addDays(new Date(), 1) &&
            record.completionStatus === true
        ).length || 0;
    this.numOfCompletion = count;
  }

  public calculateStreaks(): void {
    let delta: (date: Date) => number;
    let startDateFunction: (date: Date) => Date;
    let frequency: (startDate: Date, endDate: Date) => number;
    let findStartDateFunction: (date: Date, streak: number) => Date;
    switch (this.habitData?.frequency) {
      case Freqeuncy.Day:
        delta = (date: Date) => {
          return 1;
        };
        startDateFunction = (date: Date) => {
          return date;
        };
        frequency = (endDate: Date, startDate: Date) => {
          return differenceInDays(addDays(endDate, 1), startDate);
        };
        findStartDateFunction = (date: Date, streak: number) => {
          return subDays(date, streak);
        };
        break;
      case Freqeuncy.Week:
        delta = (date: Date) => {
          return 7;
        };
        startDateFunction = (date: Date) => {
          // to return 1/30/2023 00:00AM
          return date;
        };
        frequency = (endDate: Date, startDate: Date) => {
          return differenceInWeeks(endDate, startDate, {
            roundingMethod: 'ceil',
          });
        };
        findStartDateFunction = (date: Date, streak: number) => {
          return date;
        };
        break;
      case Freqeuncy.Month:
        delta = (date: Date) => {
          return getDaysInMonth(date);
        };
        startDateFunction = (date: Date) => {
          return date;
        };
        frequency = (startDate: Date, endDate: Date) => {
          return differenceInMonths(startDate, endDate);
        };
        findStartDateFunction = (date: Date, streak: number) => {
          return date;
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
      const earliestDate = new Date(records[0].date);
      let startDate = startDateFunction(earliestDate);
      let endDate = endOfDay(new Date());
      let diffInTime =
        frequency(endDate, startDate) === 0 ? 1 : frequency(endDate, startDate);
      let currentStreak = 0;
      let startDateofInterval = startDate;

      for (let i = 0; i < diffInTime; i++) {
        let nextStartDateofInterval = addDays(
          startDateofInterval,
          delta(startDateofInterval)
        );
        let endDateTimeofInterval = endOfDay(
          subDays(nextStartDateofInterval, 1)
        );
        let filteredArray = records.filter(
          (item) =>
            item.completionStatus &&
            isWithinInterval(new Date(item.date), {
              start: startDateofInterval,
              end: endDateTimeofInterval,
            })
        );
        if (filteredArray.length >= this.habitData.countPerFreq) {
          currentStreak += 1;
        } else {
          this.streaks.push({
            streak: currentStreak,
            startDate: findStartDateFunction(
              startDateofInterval,
              currentStreak
            ),
            endDate: endDateTimeofInterval,
          });
          currentStreak = 0;
        }
        if (i !== diffInTime - 1) {
          startDateofInterval = nextStartDateofInterval;
          console.log(startDateofInterval);
        }
      }
      console.log(startDateofInterval);
      this.streaks.push({
        streak: currentStreak,
        startDate: findStartDateFunction(startDateofInterval, currentStreak),
        // endDate: endDateTimeofInterval,
      });
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
          return startOfDay(date); //should return 00:00
        };
        endDateFunction = (date: Date) => {
          return endOfDay(date);
        };
        break;
      case Freqeuncy.Week:
        startDateFunction = (date: Date) => {
          // to return 1/30/2023 00:00AM
          return startOfWeek(date, { weekStartsOn: 1 });
        };
        endDateFunction = (date: Date) => {
          return endOfWeek(date, { weekStartsOn: 1 }); // Mon~Sun
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
    let startDate = startDateFunction(new Date()); // 00:00am
    let endDate = endDateFunction(startDate); // 23:59pm
    let findTrueCount = this.store
      .selectSnapshot(DailyHabitRecordState.dailyCompletionStatus)!
      .filter(
        (record) =>
          record.habitId === this.habitId &&
          record.completionStatus === true &&
          record.date <= format(endDate, 'MM/dd/yyyy') &&
          record.date >= format(startDate, 'MM/dd/yyyy') //date range (daily: 00:00 ~ 23:59 / weekly mon~sun / monthly 1st ~ 31)
      ).length;
    const result = (findTrueCount / this.habitData?.countPerFreq!) * 100;
    if (result >= 100) {
      return 100;
    }
    return result;
  }

  private calculateAvgScore() {
    let delta: (date: Date) => number;
    let startDateFunction: (date: Date) => Date;
    let endDateFunction: (date: Date) => Date;
    let maxStreaksFunction: (endDate: Date, startDate: Date) => number;
    switch (this.habitData?.frequency) {
      case Freqeuncy.Day:
        delta = (date: Date) => {
          return 1;
        };
        startDateFunction = (date: Date) => {
          return startOfDay(date); //should return 00:00
        };
        endDateFunction = (date: Date) => {
          return addDays(endOfDay(date), 1);
        };
        maxStreaksFunction = (endDate: Date, startDate: Date) =>
          differenceInDays(endDate, startDate);
        break;
      case Freqeuncy.Week:
        delta = (date: Date) => {
          return 7;
        };
        startDateFunction = (date: Date) => {
          // to return 1/30/2023 00:00AM
          return startOfWeek(date, { weekStartsOn: 1 });
        };
        endDateFunction = (date: Date) => {
          return addDays(endOfWeek(date, { weekStartsOn: 1 }), 1); // Mon~Sun
        };
        maxStreaksFunction = (endDate: Date, startDate: Date) =>
          differenceInWeeks(endDate, startDate, { roundingMethod: 'ceil' });
        break;
      case Freqeuncy.Month:
        delta = (date: Date) => {
          return getDaysInMonth(date);
        };
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

    const records = this.store
      .selectSnapshot(DailyHabitRecordState.dailyCompletionStatus)
      ?.filter((record) => record.habitId === this.habitId);
    if (records && records.length >= 1) {
      let startDate = startDateFunction(new Date(records[0].date)); //start date of calculating range
      let endDate = endDateFunction(new Date()); //end date of calculating range
      let maxStreaks = maxStreaksFunction(endDate, startDate);
      // Find 100% streak period (if goal / target = 1 => streak +=1)
      let earnedStreaks = 0;
      let intervalStart = startDate;
      for (let i = 0; i < maxStreaks; i++) {
        let intervalEnd = addDays(intervalStart, delta(intervalStart));
        const trueWithinInterval = records.filter(
          (record) =>
            record.completionStatus === true &&
            record.date >= format(intervalStart, 'MM/dd/yyyy') &&
            record.date < format(intervalEnd, 'MM/dd/yyyy')
        );
        intervalStart = intervalEnd; //update value of intervalStart after 1 loop
        if (trueWithinInterval.length / this.habitData?.countPerFreq! >= 1) {
          earnedStreaks += 1; // earn 1 point of weekly goal has met
        }
      }
      let result = (earnedStreaks / maxStreaks) * 100;
      return result >= 100 ? 100 : result;
    }
    return 0;
  }
}
