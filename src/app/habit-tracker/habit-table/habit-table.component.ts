import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Habit } from 'src/app/shared/models/habit';
import { format, getDaysInMonth } from 'date-fns';
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

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.daysInMonth = getDaysInMonth(
      new Date(
        this.currentFullDate.getFullYear(),
        this.currentFullDate.getMonth()
      )
    );

    this.habitsList = this.store.selectSnapshot(HabitState.habitsList);
  }

  public changeMonth(direction: number) {
    this.currentFullDate = new Date(
      this.currentFullDate.setMonth(this.currentFullDate.getMonth() + direction)
    );
    this.daysInMonth = getDaysInMonth(
      new Date(
        this.currentFullDate.getFullYear(),
        this.currentFullDate.getMonth()
      )
    );
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
      .subscribe();
  }
  //pass dailyhabitrecord to state
}
