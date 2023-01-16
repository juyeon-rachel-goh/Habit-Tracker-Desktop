import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DailyMood } from 'src/app/shared/models/daily-mood';
import { MoodDataService } from 'src/app/shared/services/mood-data.service';
import { HabitService } from 'src/app/shared/services/habit.service';
import { Habit } from 'src/app/shared/models/habit';
import { format, getDaysInMonth } from 'date-fns';

@Component({
  selector: 'app-habit-table',
  templateUrl: './habit-table.component.html',
  styleUrls: ['./habit-table.component.scss'],
})
export class HabitTableComponent implements OnInit {
  public currentFullDate = new Date();
  public daysInMonth: number = 0;

  moodImage: DailyMood[] = [];
  habits: Habit[] = [];

  constructor(
    private router: Router,
    private moodDataService: MoodDataService,
    private habitService: HabitService
  ) {}

  ngOnInit(): void {
    // run to get currentMonth's daysInMonth
    this.daysInMonth = getDaysInMonth(
      new Date(
        this.currentFullDate.getFullYear(),
        this.currentFullDate.getMonth()
      )
    );
    // Get habits
    this.habitService.getHabits().subscribe((data) => (this.habits = data));
    //Mood Icons -> why logging multiple times though?//
    this.moodDataService.dailyMood.subscribe((value) => {
      this.moodImage = value;
    });
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

  public findMatchingObj(year: number, month: number, date: number) {
    const eventDate = format(new Date(year, month, date), 'MM/dd/yyyy');
    const arr = this.moodImage.filter((obj) => obj.eventDate === eventDate);
    if (arr) {
      return arr[0]?.mood;
    } else {
      return null;
    }
  }
}
