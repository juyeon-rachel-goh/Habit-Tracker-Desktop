import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Mood } from 'src/app/habit-tracker/enums/mood';
import { HabitDataService } from 'src/app/shared/services/habit-data.service';

@Component({
  selector: 'app-habit-mood-selector',
  templateUrl: './habit-mood-selector.component.html',
  styleUrls: ['./habit-mood-selector.component.scss'],
})
export class HabitMoodSelectorComponent implements OnInit {
  public enumMood = Mood;
  public moodToday = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private habitDataService: HabitDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.moodToday = this.formBuilder?.group({
      mood: [null, [Validators.required]],
    });
  }

  onSubmitMood() {
    this.habitDataService.setMood(this.moodToday.value.mood);
    //send data to the server//
    this.router.navigate(['/habit-tracker']);
  }
}
