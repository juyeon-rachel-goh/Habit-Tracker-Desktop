import { Component, OnInit } from '@angular/core';
import { Habit } from 'src/app/shared/models/habit';
import {
  addMonths,
  endOfMonth,
  format,
  getDaysInMonth,
  isBefore,
  startOfDay,
  subMonths,
} from 'date-fns';
import { Store } from '@ngxs/store';
import { take, tap } from 'rxjs';
import { HabitState } from 'src/app/store/habit.state';
import { AddRecord, DeleteLastRecord } from 'src/app/store/daily-record.action';
import { MatDialog } from '@angular/material/dialog';
import { HabitArchiveComponent } from '../habit-archive/habit-archive.component';
import { HabitMoodSelectorComponent } from '../habit-mood-selector/habit-mood-selector.component';
import { HabitDetailComponent } from '../habit-detail/habit-detail.component';
import { HabitEditComponent } from '../habit-edit/habit-edit.component';
import { DailyHabitRecordState } from 'src/app/store/daily-record.state';
import { DailyHabitRecord } from 'src/app/shared/models/daily-habit-record';
@Component({
  selector: 'app-habit-table',
  templateUrl: './habit-table.component.html',
  styleUrls: ['./habit-table.component.scss'],
})
export class HabitTableComponent implements OnInit {
  public habitsList: Habit[] = [];
  public dailyRecords: DailyHabitRecord[] = [];
  public currentFullDate = new Date();
  public daysInMonth: number = 0;
  public foundMatchingEventDate: boolean = false;
  public moodImage: string = '';
  public disabledCell!: boolean;
  public completionCount: number = 0;

  constructor(private store: Store, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.daysInMonth = getDaysInMonth(
      new Date(
        this.currentFullDate.getFullYear(),
        this.currentFullDate.getMonth()
      )
    );

    this.habitsList = this.store
      .selectSnapshot(HabitState.habitsList)
      .filter(
        (data) =>
          isBefore(new Date(data.createdOn), this.currentFullDate) &&
          data.archiveStatus === false
      );

    this.dailyRecords = this.store.selectSnapshot(
      DailyHabitRecordState.dailyCompletionStatus
    )!;
  }

  public loadMonth(direction: string) {
    if (direction === 'prev') {
      this.currentFullDate = endOfMonth(subMonths(this.currentFullDate, 1));
    } else if (direction === 'next') {
      this.currentFullDate = endOfMonth(addMonths(this.currentFullDate, 1)); // use lastday of month!! without endOfMonth, Feb -> Jan sets date to 1/28
    } else {
      console.warn('Not a valid action!!');
    }
    this.daysInMonth = getDaysInMonth(new Date(this.currentFullDate));
    this.habitsList = this.store
      .selectSnapshot(HabitState.habitsList)
      .filter(
        (data) =>
          isBefore(new Date(data.createdOn), this.currentFullDate) &&
          data.archiveStatus === false
      );
  }

  public onOpenMoodSelector(year: number, month: number, date: number) {
    const eventDate = format(new Date(year, month, date), 'yyyy/MM/dd');
    this.dialog.open(HabitMoodSelectorComponent, {
      data: eventDate,
    });
  }

  public changeCompletionStatus(
    date: number,
    habitId: string,
    event: MouseEvent
  ) {
    const year = this.currentFullDate.getFullYear();
    const month = this.currentFullDate.getMonth();
    const eventDate = format(new Date(year, month, date), 'yyyy/MM/dd');
    if (event.altKey) {
      // alt + double click -> delete the latest record
      // find the last record with matching habitId and eventDate
      const recordId = this.dailyRecords
        .filter(
          (habit) => habit.habitId === habitId && habit.date === eventDate
        )
        .pop()?.id;
      if (recordId) {
        this.store
          .dispatch(new DeleteLastRecord(recordId))
          .pipe(
            take(1),
            tap(() => window.location.reload())
          )
          .subscribe();
      }
    } else {
      if (new Date(year, month, date) <= new Date()) {
        // double click -> add
        const record = {
          date: eventDate,
          habitId: habitId,
        };
        this.store
          .dispatch(new AddRecord(record))
          .pipe(
            take(1),
            tap(() => window.location.reload())
          )
          .subscribe();
      } else {
        window.alert('You cannot complete future task!');
      }
    }
  }

  public disableAddRecord(day: number, createdOn: Date): string {
    const year = this.currentFullDate.getFullYear();
    const month = this.currentFullDate.getMonth();
    const eventDate = new Date(year, month, day);
    const createdOnStr = startOfDay(new Date(createdOn));

    if (eventDate < createdOnStr) {
      this.disabledCell = true;
      return 'rgba(36,36,36,0.2)';
    } else {
      this.disabledCell = false;
      return '';
    }
  }
  public onAddHabit() {
    this.dialog.open(HabitEditComponent, {});
  }
  public onViewDetail(habitId: string) {
    this.dialog.open(HabitDetailComponent, {
      data: habitId,
    });
  }
  public onViewArchive() {
    this.dialog.open(HabitArchiveComponent, {
      height: '600px',
      width: '500px',
    });
  }

  findCompletionStatus(date: number, habitId: string): boolean {
    const year = this.currentFullDate.getFullYear();
    const month = this.currentFullDate.getMonth();
    const eventDate = format(new Date(year, month, date), 'yyyy/MM/dd');
    const habitCompleted = this.dailyRecords.filter(
      (item) => item.date === eventDate && item.habitId === habitId
    );
    if (habitCompleted && habitCompleted.length >= 1) {
      this.completionCount = habitCompleted.length;
      return true;
    } else {
      return false;
    }
  }
}
