import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Mood } from 'src/app/habit-tracker/enums/mood';
import { MoodDataService } from 'src/app/shared/services/mood-data.service';

@Component({
  selector: 'app-habit-mood-selector',
  templateUrl: './habit-mood-selector.component.html',
  styleUrls: ['./habit-mood-selector.component.scss'],
})
export class HabitMoodSelectorComponent implements OnInit {
  public enumMood = Mood;
  public moodToday = new FormGroup({});
  eventDate: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private MoodDataService: MoodDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params) {
        console.log(params);
        this.eventDate = params.get('id') || '';
      }
    });

    this.moodToday = this.formBuilder?.group({
      eventDate: [this.eventDate],
      mood: [null, [Validators.required]],
    });
  }

  onSubmitMood() {
    this.MoodDataService.setMood(this.moodToday.value);
    //send data to the server//
    this.router.navigate(['/habit-tracker']);
  }
}
