import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-habit-table',
  templateUrl: './habit-table.component.html',
  styleUrls: ['./habit-table.component.scss'],
})
export class HabitTableComponent implements OnInit {
  public currentFullDate = new Date();

  constructor() {}

  ngOnInit(): void {
    // run to get currentMonth's daysInMonth
    let daysInMonth = this.getDaysInMonth(
      this.currentFullDate.getFullYear(),
      this.currentFullDate.getMonth() + 1
    );
    console.log(daysInMonth);
  }

  public changeMonth(direction: number) {
    this.currentFullDate = new Date(
      this.currentFullDate.setMonth(this.currentFullDate.getMonth() + direction)
    );
    let daysInMonth = this.getDaysInMonth(
      this.currentFullDate.getFullYear(),
      this.currentFullDate.getMonth() + 1
    );
  }

  private getDaysInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
  }
}
