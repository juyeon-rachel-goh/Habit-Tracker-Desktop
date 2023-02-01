import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
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

@Component({
  selector: 'app-habit-detail',
  templateUrl: './habit-detail.component.html',
  styleUrls: ['./habit-detail.component.scss'],
})
export class HabitDetailComponent implements OnInit {
  public habitData?: Habit;
  public habitId: string = '';
  public currentArchiveStatus: string = '';
  public isArchived!: boolean;
  public numOfCompletion: number = 0;
  public currentStreak: number = 0;
  public bestStreak: number = 0;
  public currentScore: number = 0;
  public habitScore: number = 100;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params) {
        this.habitId = params.get('id') || '';
      }

      this.habitData = this.store.selectSnapshot(HabitState.getHabitbyId)(
        this.habitId
      );
    });

    this.findnumOfCompletion(this.habitId);
    // this.findStreaks(this.habitId);
    // this.findBestStreak();
    this.currentStreak = this.findCurrentStreak();
    this.currentScore = this.calculateGoalMet();
    this.calculateOverallScore(this.habitId);
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
        tap(() => console.log('update success!')),
        catchError((err) => {
          throw alert(err.message);
        })
      )
      .subscribe();
    // this.habitService.archiveHabit(this.isArchived, this.habitId).subscribe();
  }

  onEdit(id: string) {
    this.router.navigate([`/habit-tracker/edit/${id}`]);
  }

  onDelete() {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      const habitsList = this.store.selectSnapshot(HabitState.habitsList);
      const result = habitsList!.find((mood) => mood.id === this.habitId);
      this.store
        .dispatch(new DeleteHabit(result?.id!))
        .pipe(
          take(1),
          tap(() => this.router.navigate(['/habit-tracker'])),
          catchError((err) => {
            throw alert(err.message);
          })
        )
        .subscribe();
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

  /////////////////////////////NEED NEW LOGIC FOR WEEK/MONTH Calculations ////////////////////////////
  private findStreaks(habitId: string) {
    const records = this.store
      .selectSnapshot(DailyHabitRecordState.dailyCompletionStatus)!
      .filter((record) => record.habitId === habitId);
    // dateRange to loop = createdOn~today
    const startDate = new Date(this.habitData!.createdOn);
    const endDate = new Date();

    let resultArr = [];
    for (let i = startDate; startDate <= endDate; i.setDate(i.getDate() + 1)) {
      let date = format(new Date(i), 'MM/dd/yyyy');
      // find matching date from [records]
      const matching = records.find((record) => record.date === date);
      if (matching) {
        resultArr.push(matching?.completionStatus);
      } else {
        resultArr.push(false);
      }
    }
    // Find CURRENT streak
    const index = resultArr.lastIndexOf(false);
    const currentStreak = resultArr.slice(index + 1).length;
    console.log(currentStreak);
    this.currentStreak = currentStreak;
    // Find BEST streak
    let valueStr = resultArr.join('');
    const countTrue = valueStr.split('false').filter(Boolean);
    if (countTrue.length > 0) {
      const numOfStreaks = countTrue.map((x) => x.length / 4);
      this.bestStreak = Math.max(...numOfStreaks);
    } else {
      this.bestStreak = 0;
    }
  }

  private findCurrentStreak(): number {
    let delta: (date: Date) => number;
    let startDateFunction: (date: Date) => Date;
    let frequency: (startDate: Date, endDate: Date) => number;
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
        break;
      case Freqeuncy.Week:
        delta = (date: Date) => {
          return 7;
        };
        startDateFunction = (date: Date) => {
          // to return 1/30/2023 00:00AM
          return startOfWeek(date, { weekStartsOn: 1 });
        };
        frequency = (endDate: Date, startDate: Date) => {
          return differenceInWeeks(endDate, startDate, {
            roundingMethod: 'ceil',
          });
        };
        break;
      case Freqeuncy.Month:
        delta = (date: Date) => {
          return getDaysInMonth(date);
        };
        startDateFunction = (date: Date) => {
          return startOfMonth(date);
        };
        frequency = (startDate: Date, endDate: Date) => {
          return differenceInMonths(startDate, endDate);
        };
        break;
      default:
        return 0;
    }

    const records = this.store
      .selectSnapshot(DailyHabitRecordState.dailyCompletionStatus)
      ?.filter((record) => record.habitId === this.habitData?.id);
    if (records && records?.length === 0) {
      return 0;
    } else if (records) {
      const earliestDate = new Date(records[0].date);
      let startDate = startDateFunction(earliestDate);
      // endDate = if date = last record, day currentstreak count becomes off
      let endDate = endOfDay(new Date());
      // diffInTime = must return 1 if 0 to get day count right
      let diffInTime =
        frequency(endDate, startDate) === 0 ? 1 : frequency(endDate, startDate);
      let currentStreak = 0;
      for (let i = 0; i < diffInTime; i++) {
        let startDateofInterval = startDate;
        let nextStartDateofInterval = addDays(
          // need new Date starting at 00:00:00
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
              end: endDateTimeofInterval, //need 23:59:59 of the previouse date
            })
        );
        console.log('interval starts: ' + startDateofInterval);
        console.log('interval ends: ' + endDateTimeofInterval);
        console.log('Records found within the interval: ');
        console.log(filteredArray);
        let str1 = '';
        if (filteredArray.length >= this.habitData.countPerFreq) {
          currentStreak += 1;
        } else {
          currentStreak = 0;
        }
        startDate = nextStartDateofInterval;
        console.log('next interval starts at: ' + startDate);
      }
      return currentStreak;
    }
    return 0;
  }
  private findBestStreak() {}

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

  private calculateOverallScore(habitId: string) {
    const frequency = this.habitData?.frequency;
    if (frequency === 'Day') {
      //When frequency = Daily
      const endDate = addDays(new Date(), 1); // add +1 for today
      const startDate = new Date(this.habitData?.createdOn!); // add +1 for today

      const maxStreaks = differenceInCalendarDays(endDate, startDate);
      //countTRUE
      const countTrue = this.store
        .selectSnapshot(DailyHabitRecordState.dailyCompletionStatus)!
        .filter(
          (record) =>
            record.habitId === habitId &&
            record.completionStatus === true &&
            record.date < format(endDate, 'MM/dd/yyyy')
        ).length;
      // CountTRUE / maxStreaks * 100 = score
      this.habitScore = (countTrue / maxStreaks) * 100;
    } else if (frequency === 'Week') {
      const startDate = startOfWeek(new Date(this.habitData?.createdOn!), {
        weekStartsOn: 1,
      });
      const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
      const maxStreaks = differenceInCalendarWeeks(
        new Date(endDate),
        new Date(startDate),
        { weekStartsOn: 1 }
      );
      // Find 100% streak week (if goal / target = 1 => streak +=1)
      let earnedStreak = 0;
      for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 7)) {
        // find true's within the date range
        const findTrue = this.store
          .selectSnapshot(DailyHabitRecordState.dailyCompletionStatus)!
          .filter(
            (record) =>
              record.habitId === habitId &&
              record.completionStatus === true &&
              record.date <= format(addDays(startDate, 6), 'MM/dd/yyyy') &&
              record.date >= format(startDate, 'MM/dd/yyyy')
          );
        if (findTrue.length / this.habitData?.countPerFreq! >= 1) {
          earnedStreak += 1; // earn 1 point of weekly goal has met
        }
      }
      this.habitScore = (earnedStreak / maxStreaks) * 100;
    } else if (frequency === 'Month') {
      const startDate = startOfMonth(new Date(this.habitData?.createdOn!));
      const endDate = endOfMonth(new Date());
      const maxStreaks = differenceInCalendarMonths(
        new Date(endDate),
        new Date(startDate)
      );
      // Find 100% streak week (if goal / target = 1 => streak +=1)
      let earnedStreak = 0;
      for (let d = startDate; d <= endDate; d.setMonth(d.getMonth() + 1)) {
        // find true's within the date range
        const findTrue = this.store
          .selectSnapshot(DailyHabitRecordState.dailyCompletionStatus)!
          .filter(
            (record) =>
              record.habitId === habitId &&
              record.completionStatus === true &&
              record.date <= format(addMonths(startDate, 1), 'MM/dd/yyyy') &&
              record.date >= format(startDate, 'MM/dd/yyyy')
          );
        if (findTrue.length / this.habitData?.countPerFreq! >= 1) {
          earnedStreak += 1; // earn 1 point of weekly goal has met
        }
      }
      this.habitScore = (earnedStreak / maxStreaks) * 100;
    }
  }
}
