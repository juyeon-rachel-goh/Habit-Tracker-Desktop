import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Habit } from 'src/app/shared/models/habit';
import {
  addMonths,
  format,
  getDaysInMonth,
  isBefore,
  subMonths,
} from 'date-fns';
import { Select, Store } from '@ngxs/store';
import { Observable, map, take, tap } from 'rxjs';
import { HabitState } from 'src/app/store/habit.state';

import { ChangeCompletionStatus } from 'src/app/store/daily-record.action';

@Component({
  selector: 'app-habit-table',
  templateUrl: './habit-table.component.html',
  styleUrls: ['./habit-table.component.scss'],
})
export class HabitTableComponent implements OnInit {
  public habitsList: Habit[] = [];
  public currentFullDate = new Date();
  public daysInMonth: number = 0;
  public foundMatchingEventDate: boolean = false;
  public moodImage: string = '';
  public enableClick!: boolean;

  constructor(
    private router: Router,
    private store: Store,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.daysInMonth = getDaysInMonth(
      new Date(
        this.currentFullDate.getFullYear(),
        this.currentFullDate.getMonth()
      )
    );

    this.habitsList = this.store.selectSnapshot(HabitState.habitsList).filter(
      (data) => isBefore(new Date(data.createdOn), this.currentFullDate) // add archive status filter
    );
  }

  public changeMonth(direction: string) {
    if (direction === 'prev') {
      this.currentFullDate = subMonths(this.currentFullDate, 1);
    } else if (direction === 'next') {
      this.currentFullDate = addMonths(this.currentFullDate, 1);
    } else {
      console.warn('Not a valid action!!');
    }
    this.daysInMonth = getDaysInMonth(new Date(this.currentFullDate));
    this.habitsList = this.store
      .selectSnapshot(HabitState.habitsList)
      .filter((data) =>
        isBefore(new Date(data.createdOn), this.currentFullDate)
      );

    console.log(this.habitsList);
  }

  public onOpenMoodSelector(year: number, month: number, date: number) {
    // find real mood id based on year/month/date
    const eventDate = format(new Date(year, month, date), 'MM/dd/yyyy'); // String format
    this.router.navigate(['habit-tracker/mood-selector', eventDate]);
  }

  public onChangeCompletionStatus(
    year: number,
    month: number,
    date: number,
    habitId: string
  ) {
    const eventDate = format(new Date(year, month, date), 'MM/dd/yyyy'); // String format
    const recordSource = {
      date: eventDate,
      habitId: habitId,
    };
    this.store
      .dispatch(new ChangeCompletionStatus(recordSource))
      .pipe(
        take(1),
        tap(() => window.location.reload())
      )
      .subscribe(() => this.ref.detectChanges());
  }

  public enableButtonAndStyle(
    year: number,
    month: number,
    date: number,
    habitId: string
  ) {
    const eventDate = format(new Date(year, month, date), 'MM/dd/yyyy');
    const createdOnDate = format(
      new Date(
        this.habitsList.find((habit) => habit.id === habitId)?.createdOn!
      ),
      'MM/dd/yyyy'
    );
    if (eventDate < createdOnDate) {
      this.enableClick = false;
      return 'rgba(36,36,36,0.2)';
    } else {
      this.enableClick = true;
      return 'null';
    }
  }
}
