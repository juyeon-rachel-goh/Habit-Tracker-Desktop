import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DailyMood } from 'src/app/shared/models/daily-mood';
import { HabitService } from 'src/app/shared/services/habit.service';
import { Habit } from 'src/app/shared/models/habit';
import { format, getDaysInMonth } from 'date-fns';
import { Select, Store } from '@ngxs/store';
import { GetDailyMoods } from 'src/app/store/mood.action';
import { Observable, map } from 'rxjs';
import { MoodState } from 'src/app/store/mood.state';

@Component({
  selector: 'app-habit-table',
  templateUrl: './habit-table.component.html',
  styleUrls: ['./habit-table.component.scss'],
})
export class HabitTableComponent implements OnInit {
  @Select(MoodState.dailyMoodList) dailyMoodList?: Observable<DailyMood[]>;
  public moodImage: string = '';
  public foundMatchingEventDate: boolean = false;
  public currentFullDate = new Date();
  public daysInMonth: number = 0;
  habits: Habit[] = [];

  constructor(
    private router: Router,
    private habitService: HabitService,
    private store: Store
  ) {}

  ngOnInit(): void {
    // run to get currentMonth's daysInMonth
    this.daysInMonth = getDaysInMonth(
      new Date(
        this.currentFullDate.getFullYear(),
        this.currentFullDate.getMonth()
      )
    );

    // GET DAILY MOODS AND HABITS
    this.store.dispatch(new GetDailyMoods());
    this.habitService.getHabits().subscribe((data) => (this.habits = data));
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
    const id = format(new Date(year, month, date), 'MM/dd/yyyy'); // String format
    this.router.navigate(['habit-tracker/mood-selector', id]);
  }

  public findMoodImage(year: number, month: number, date: number) {
    const eventDate = format(new Date(year, month, date), 'MM/dd/yyyy');

    this.dailyMoodList
      ?.pipe(
        map((res) => {
          const result = res.filter((mood) => mood.eventDate === eventDate);
          if (result.length === 1) {
            this.moodImage = result[0].mood;
            return true;
          } else {
            return false;
          }
        })
      )
      .subscribe((result) => {
        this.foundMatchingEventDate = result;
      });
    return this.foundMatchingEventDate;
  }
}
