import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DailyMood } from 'src/app/shared/models/daily-mood';
import { Habit } from 'src/app/shared/models/habit';
import { format, getDaysInMonth } from 'date-fns';
import { Select, Store } from '@ngxs/store';
import { GetDailyMoods } from 'src/app/store/mood.action';
import { Observable, map } from 'rxjs';
import { MoodState } from 'src/app/store/mood.state';
import { GetHabits } from 'src/app/store/habit.action';
import { HabitState } from 'src/app/store/habit.state';
import { MoodService } from 'src/app/shared/services/mood.service';

@Component({
  selector: 'app-habit-table',
  templateUrl: './habit-table.component.html',
  styleUrls: ['./habit-table.component.scss'],
})
export class HabitTableComponent implements OnInit {
  @Select(HabitState.habitsList) habitsList?: Observable<Habit[]>;
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

    this.store.dispatch(new GetHabits());
  }

  ngAfterViewInit() {}

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
    const id = format(new Date(year, month, date), 'MM/dd/yyyy'); // String format
    this.router.navigate(['habit-tracker/mood-selector', id]);
  }
}
