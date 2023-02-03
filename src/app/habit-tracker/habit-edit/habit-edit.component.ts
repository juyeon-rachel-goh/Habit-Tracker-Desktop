import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Freqeuncy } from 'src/app/habit-tracker/enums/frequency';
import { IconColor } from 'src/app/habit-tracker/enums/icon-color';
import { Habit } from 'src/app/shared/models/habit';
import { Store } from '@ngxs/store';
import { HabitState } from 'src/app/store/habit.state';
import { UpsertHabit } from 'src/app/store/habit.action';
import { catchError, take, tap } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-habit-edit',
  templateUrl: './habit-edit.component.html',
  styleUrls: ['./habit-edit.component.scss'],
})
export class HabitEditComponent implements OnInit {
  public habitForm = new FormGroup({});
  private habitData?: Habit;
  public enumFrequency = Freqeuncy;
  public enumIconColor = IconColor;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private dialogRef: MatDialogRef<HabitEditComponent>,
    @Inject(MAT_DIALOG_DATA) public id: string // value passed from Mat-dialog
  ) {}

  ngOnInit(): void {
    if (this.id) {
      this.habitData = this.store.selectSnapshot(HabitState.getHabitbyId)(
        this.id
      );
      this.initForm(this.habitData);
      this.habitForm.addControl('id', new FormControl(this.id));
      this.habitForm.addControl(
        'archiveStatus',
        new FormControl(this.habitData?.archiveStatus)
      );
      this.habitForm.addControl(
        'createdOn',
        new FormControl(this.habitData?.createdOn)
      );
    } else {
      this.initForm();
    }
  }

  onSubmit() {
    this.store
      .dispatch(new UpsertHabit(this.habitForm.value))
      .pipe(
        take(1),
        tap(() => this.dialogRef.close()),
        catchError((err) => {
          throw alert(err.message);
        })
      )
      .subscribe(() => window.location.reload());
    // loading spinner -> submission successful! ->
  }

  onSelectRandIconColor() {
    const enumValues = Object.values(this.enumIconColor);
    let selectedColor =
      enumValues[Math.floor(Math.random() * enumValues.length)];
    this.habitForm.patchValue({
      iconColor: selectedColor,
    });
  }

  private initForm(habit?: Habit) {
    this.habitForm = this.formBuilder?.group({
      habitName: [habit?.habitName ?? '', [Validators.required]],
      frequency: [habit?.frequency ?? '', [Validators.required]],
      countPerFreq: [
        habit?.countPerFreq ?? '',
        [Validators.required, Validators.min(1)],
      ],
      iconColor: [habit?.iconColor ?? '', [Validators.required]],
    });
  }
}
