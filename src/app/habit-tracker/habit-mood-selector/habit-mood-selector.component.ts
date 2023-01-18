import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { Mood } from 'src/app/habit-tracker/enums/mood';
import { MoodService } from 'src/app/shared/services/mood.service';
import { Store } from '@ngxs/store';
import { UpdateDailyMood } from 'src/app/store/mood.action';

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
    private moodService: MoodService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
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
    this.store.dispatch(new UpdateDailyMood(this.moodToday.value));
    // this.moodService.updateMood(this.moodToday.value).subscribe();
    this.router.navigate(['/habit-tracker']);
  }
}
