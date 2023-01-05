import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-habit-mood-selector',
  templateUrl: './habit-mood-selector.component.html',
  styleUrls: ['./habit-mood-selector.component.scss'],
})
export class HabitMoodSelectorComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  onSaveMood(mood: string) {
    console.log(mood);
  }
}
