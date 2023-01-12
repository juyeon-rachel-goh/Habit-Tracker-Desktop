import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HabitDataService } from 'src/app/shared/services/habit-data.service';

@Component({
  selector: 'app-habit-table',
  templateUrl: './habit-table.component.html',
  styleUrls: ['./habit-table.component.scss'],
})
export class HabitTableComponent implements OnInit {
  public currentFullDate = new Date();
  daysInMonth: number = 0;

  Habit_1 = [
    { date: '1', completionStatus: 'True' },
    { date: '2', completionStatus: 'False' },
    { date: '3', completionStatus: 'True' },
    { date: '4', completionStatus: 'True' },
    { date: '5', completionStatus: 'True' },
    { date: '5', completionStatus: 'True' },
  ];

  moodImage: string = '';

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

    //Mood Icons//
    this.habitDataService.selectedMood.subscribe((value) => {
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

  public onOpenMoodSelector() {
    this.router.navigate(['habit-tracker/mood-selector']);
  }
}
