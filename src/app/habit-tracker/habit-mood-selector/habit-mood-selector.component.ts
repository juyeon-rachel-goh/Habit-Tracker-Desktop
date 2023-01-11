import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Mood } from 'src/app/habit-tracker/enums/mood';

@Component({
  selector: 'app-habit-mood-selector',
  templateUrl: './habit-mood-selector.component.html',
  styleUrls: ['./habit-mood-selector.component.scss'],
})
export class HabitMoodSelectorComponent implements OnInit {
  public enumMood = Mood;
  public moodToday = new FormGroup({});

  constructor() {}

  ngOnInit(): void {}

  onSubmitMood() {
    console.log('it works');
  }
}
