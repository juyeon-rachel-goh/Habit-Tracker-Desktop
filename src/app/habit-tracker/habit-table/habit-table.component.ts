import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DailyMood } from 'src/app/shared/models/daily-mood';
import { MoodDataService } from 'src/app/shared/services/mood-data.service';
import { HabitService } from 'src/app/shared/services/habit.service';
import { Habit } from 'src/app/shared/models/habit';

@Component({
  selector: 'app-habit-table',
  templateUrl: './habit-table.component.html',
  styleUrls: ['./habit-table.component.scss'],
})
export class HabitTableComponent implements OnInit {
  public currentFullDate = new Date();
  daysInMonth: number = 0;

  moodImage: DailyMood[] = [];
  habits: Habit[] = [];

  habitComplete = false;

  constructor(
    private router: Router,
    private moodDataService: MoodDataService,
    private habitService: HabitService
  ) {}

  ngOnInit(): void {
    // run to get currentMonth's daysInMonth
    let daysInMonth = this.getDaysInMonth(
      this.currentFullDate.getFullYear(),
      this.currentFullDate.getMonth() + 1
    );
    this.daysInMonth = daysInMonth;
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
    let daysInMonth = this.getDaysInMonth(
      this.currentFullDate.getFullYear(),
      this.currentFullDate.getMonth() + 1
    );
    this.daysInMonth = daysInMonth;
  }

  private getDaysInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
  }

  public onOpenMoodSelector(index: number) {
    this.router.navigate(['habit-tracker/mood-selector', index]);
  }

  public findMatchingObj(i: number) {
    const arr = this.moodImage.filter((obj) => obj.eventIndex === i);
    if (arr) {
      return arr[0]?.mood;
    } else {
      return null;
    }
  }
}
