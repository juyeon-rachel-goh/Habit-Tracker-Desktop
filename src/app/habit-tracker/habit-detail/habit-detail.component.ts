import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import {
  addDays,
  addWeeks,
  differenceInCalendarDays,
  differenceInCalendarWeeks,
  differenceInWeeks,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { start } from 'repl';
import { Observable, catchError, take, tap } from 'rxjs';
import { Habit } from 'src/app/shared/models/habit';
import { HabitService } from 'src/app/shared/services/habit.service';
import { DailyHabitRecordState } from 'src/app/store/daily-record.state';
import { DeleteHabit } from 'src/app/store/habit.action';
import { HabitState } from 'src/app/store/habit.state';

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
  public progress: number = 0;
  public habitScore: number = 100;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private habitService: HabitService
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
    this.findStreaks(this.habitId);
    this.calculateGoalMet(this.habitId);
    this.calculateOverallScore(this.habitId);
  }

  onClickArchive(): void {
    // button to patch value inside of the form and dispatch update action
    const currentStatus = this.store.selectSnapshot(HabitState.getHabitbyId)(
      this.habitId
    )?.archiveStatus;
    console.log(currentStatus);
    if (currentStatus == false) {
      this.isArchived = true;
    } else {
      this.isArchived = false;
    }
    this.habitService.archiveHabit(this.isArchived, this.habitId).subscribe();
  }

  onEdit(id: string) {
    this.router.navigate([`/habit-tracker/habit-edit/${id}`]);
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

  private findStreaks(habitId: string) {
    const records = this.store
      .selectSnapshot(DailyHabitRecordState.dailyCompletionStatus)!
      .filter((record) => record.habitId === habitId);
    // dateRange to loop = createdOn~today
    const startDate = new Date(this.habitData!.createdOn);
    const endDate = addDays(new Date(), 1);

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

  private calculateGoalMet(habitId: string) {
    const frequency = this.habitData?.frequency;
    if (frequency === 'Day') {
      let today = format(new Date(), 'MM/dd/yyyy');
      const findTrue = this.store
        .selectSnapshot(DailyHabitRecordState.dailyCompletionStatus)!
        .filter(
          (record) =>
            record.habitId === habitId &&
            record.completionStatus === true &&
            record.date === today
        );
      let countTrue = findTrue.length;
      const result = (countTrue / this.habitData?.countPerFreq!) * 100;
      this.progress = result;
    } else if (frequency === 'Week') {
      const startDate = format(
        startOfWeek(new Date(), { weekStartsOn: 1 }),
        'MM/dd/yyyy'
      );
      const endDate = format(
        endOfWeek(new Date(), { weekStartsOn: 1 }),
        'MM/dd/yyyy'
      );

      const findTrue = this.store
        .selectSnapshot(DailyHabitRecordState.dailyCompletionStatus)!
        .filter(
          (record) =>
            record.habitId === habitId &&
            record.completionStatus === true &&
            record.date <= endDate &&
            record.date >= startDate
        );
      let countTrue = findTrue.length;
      const result = (countTrue / this.habitData?.countPerFreq!) * 100;
      this.progress = result;
    } else if (frequency === 'Month') {
      const startDate = format(startOfMonth(new Date()), 'MM/dd/yyyy');
      const endDate = format(endOfMonth(new Date()), 'MM/dd/yyyy');
      console.log(`Date Range ${startDate} ~ ${endDate}`);
      const findTrue = this.store
        .selectSnapshot(DailyHabitRecordState.dailyCompletionStatus)!
        .filter(
          (record) =>
            record.habitId === habitId &&
            record.completionStatus === true &&
            record.date <= endDate &&
            record.date >= startDate
        );
      let countTrue = findTrue.length;
      const result = (countTrue / this.habitData?.countPerFreq!) * 100;
      this.progress = result;
    }
  }

  private calculateOverallScore(habitId: string) {
    const frequency = this.habitData?.frequency;
    if (frequency === 'Day') {
      //When frequency = Daily
      const endDate = addDays(new Date(), 1); // add +1 for today
      const startDate = new Date(this.habitData?.createdOn!); // add +1 for today

      const maxStreaks = differenceInCalendarDays(endDate, startDate);
      console.log(maxStreaks);
      //countTRUE
      const countTrue = this.store
        .selectSnapshot(DailyHabitRecordState.dailyCompletionStatus)!
        .filter(
          (record) =>
            record.habitId === habitId &&
            record.completionStatus === true &&
            record.date < format(endDate, 'MM/dd/yyyy')
        ).length;
      console.log(countTrue);
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
        console.log(d);
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
    }
  }
}
