import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DailyMood } from 'src/app/shared/models/daily-mood';
import { HabitDataService } from 'src/app/shared/services/habit-data.service';

@Component({
  selector: 'app-habit-table',
  templateUrl: './habit-table.component.html',
  styleUrls: ['./habit-table.component.scss'],
})
export class HabitTableComponent implements OnInit {
  public currentFullDate = new Date();
  daysInMonth: number = 0;

  moodImage: DailyMood[] = [];

  constructor(
    private router: Router,
    private habitDataService: HabitDataService
  ) {}

  ngOnInit(): void {
    // run to get currentMonth's daysInMonth
    let daysInMonth = this.getDaysInMonth(
      this.currentFullDate.getFullYear(),
      this.currentFullDate.getMonth() + 1
    );
    this.daysInMonth = daysInMonth;

    //Mood Icons -> why logging multiple times though?//
    this.habitDataService.dailyMood.subscribe((value) => {
      this.moodImage = value;
    });

    console.log(this.moodImage);
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
      return arr[0].mood;
    } else {
      return null;
    }
  }
}
