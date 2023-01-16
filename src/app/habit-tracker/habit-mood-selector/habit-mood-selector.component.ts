import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { Mood } from 'src/app/habit-tracker/enums/mood';
import { MoodDataService } from 'src/app/shared/services/mood-data.service';
import { MoodService } from 'src/app/shared/services/mood.service';

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
    private moodService: MoodService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params) {
        this.eventDate = params.get('id') || '';
      }
    });

    this.moodToday = this.formBuilder?.group({
      eventDate: [this.eventDate],
      mood: [null, [Validators.required]],
    });
  }

  onSubmitMood() {
    console.log(this.moodToday.value);
    this.moodService.updateMood(this.moodToday.value).subscribe();
    this.MoodDataService.setMood(this.moodToday.value);

    //send data to the server//
    this.router.navigate(['/habit-tracker']);
  }
}
