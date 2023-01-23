import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { Mood } from 'src/app/habit-tracker/enums/mood';
import { MoodService } from 'src/app/shared/services/mood.service';
import { Select, Store } from '@ngxs/store';
import { DeleteDailyMood, UpdateDailyMood } from 'src/app/store/mood.action';
import { MoodState } from 'src/app/store/mood.state';
import { Observable, catchError, map, switchMap, take, tap } from 'rxjs';
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
    this.store
      .dispatch(new UpdateDailyMood(this.moodForm.value))
      .pipe(
        take(1),
        tap(() => this.router.navigate(['/habit-tracker']))
      )
      .subscribe();
  }

  onResetMood() {
    const dailyMoodList = this.store.selectSnapshot(MoodState.dailyMoodList);
    const result = dailyMoodList!.find(
      (mood) => mood.eventDate === this.eventDate
    );
    this.store
      .dispatch(new DeleteDailyMood(result?.id!))
      .pipe(
        take(1),
        tap(() => this.router.navigate(['/habit-tracker'])),
        catchError((err) => {
          throw alert(err.message);
        })
      )
      .subscribe();
    // switchMap //
    // this.dailyMoodList
    //   ?.pipe(
    //     take(1),
    //     map((res) => {
    //       const result = res.filter(
    //         (mood) => mood.eventDate === this.eventDate
    //       );
    //       return result;
    //     }),
    //     switchMap((result) =>
    //       this.store.dispatch(new DeleteDailyMood(result[0].id!))
    //     ),
    //     tap(() => this.router.navigate(['/habit-tracker']))
    //   )
    //   .subscribe(); // add catchError
  }

  private initForm() {
    const dailyMoodList = this.store.selectSnapshot(MoodState.dailyMoodList);
    const result = dailyMoodList!.find(
      (mood) => mood.eventDate === this.eventDate
    );
    let moodFound = '';
    if (!result) {
      moodFound;
    } else {
      this.showResetButton = true;
      moodFound = result?.mood;
    }
    this.moodForm = this.formBuilder?.group({
      eventDate: [this.eventDate],
      mood: [moodFound, [Validators.required]],
    });
  }
}
