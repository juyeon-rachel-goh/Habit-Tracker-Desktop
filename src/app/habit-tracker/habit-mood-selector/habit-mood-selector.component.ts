import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Mood } from 'src/app/habit-tracker/enums/mood';
import { Store } from '@ngxs/store';
import { DeleteDailyMood, UpsertDailyMood } from 'src/app/store/mood.action';
import { MoodState } from 'src/app/store/mood.state';
import { Observable, catchError, map, switchMap, take, tap } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-habit-mood-selector',
  templateUrl: './habit-mood-selector.component.html',
  styleUrls: ['./habit-mood-selector.component.scss'],
})
export class HabitMoodSelectorComponent implements OnInit {
  enumMood = Mood;
  moodForm = new FormGroup({});
  moodToResetId?: string = '';
  showResetButton = false;
  id?: string;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private dialogRef: MatDialogRef<HabitMoodSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public eventDate?: string // value passed from Mat-dialog
  ) {}

  ngOnInit(): void {
    this.id = this.store
      .selectSnapshot(MoodState.dailyMoodList)
      ?.find((data) => data.eventDate === this.eventDate)?.id;

    this.initForm();
  }

  onSubmitMood() {
    if (this.id) {
      this.moodForm.addControl('id', new FormControl(this.id));
    }
    this.store
      .dispatch(new UpsertDailyMood(this.moodForm.value))
      .pipe(
        take(1),
        tap(() => this.dialogRef.close())
      )
      .subscribe(() => window.location.reload());
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
        tap(() => this.dialogRef.close()),
        catchError((err) => {
          throw alert(err.message);
        })
      )
      .subscribe(() => window.location.reload());
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
