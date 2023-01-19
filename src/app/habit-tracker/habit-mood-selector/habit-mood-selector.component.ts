import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { Mood } from 'src/app/habit-tracker/enums/mood';
import { MoodService } from 'src/app/shared/services/mood.service';
import { Select, Store } from '@ngxs/store';
import { DeleteDailyMood, UpdateDailyMood } from 'src/app/store/mood.action';
import { MoodState } from 'src/app/store/mood.state';
import { Observable, map, tap } from 'rxjs';
import { DailyMood } from 'src/app/shared/models/daily-mood';

@Component({
  selector: 'app-habit-mood-selector',
  templateUrl: './habit-mood-selector.component.html',
  styleUrls: ['./habit-mood-selector.component.scss'],
})
export class HabitMoodSelectorComponent implements OnInit {
  @Select(MoodState.dailyMoodList) dailyMoodList?: Observable<DailyMood[]>;
  enumMood = Mood;
  moodForm = new FormGroup({});
  moodToResetId?: string = '';
  eventDate: string = '';
  moodFound: string = '';
  showResetButton = false;

  constructor(
    private formBuilder: FormBuilder,
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
    this.initForm();
  }

  onSubmitMood() {
    this.store.dispatch(new UpdateDailyMood(this.moodForm.value));
    this.router.navigate(['/habit-tracker']);
  }

  onResetMood() {
    // //send found data[index].id to service //
    this.dailyMoodList
      ?.pipe(
        map((res) => {
          const result = res.filter(
            (mood) => mood.eventDate === this.eventDate
          );
          return result;
        })
      )
      .subscribe((res) => (this.moodToResetId = res[0]?.id));
    if (this.moodToResetId !== undefined) {
      this.store.dispatch(new DeleteDailyMood(this.moodToResetId));
      this.router.navigate(['/habit-tracker']);
    } else {
      console.warn('error!!');
    }
  }

  private initForm() {
    // Find existing mood
    this.dailyMoodList
      ?.pipe(
        map((res) => {
          const result = res.filter(
            (mood) => mood.eventDate === this.eventDate
          );
          return result;
        })
      )
      .subscribe((res) => {
        if (!res[0]?.mood) {
          return (this.moodFound = '');
        } else {
          this.showResetButton = true;
          return (this.moodFound = res[0].mood);
        }
      });
    this.moodForm = this.formBuilder?.group({
      eventDate: [this.eventDate],
      mood: [this.moodFound, [Validators.required]],
    });
  }
}
