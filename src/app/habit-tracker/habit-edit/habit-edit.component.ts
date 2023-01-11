import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HabitService } from 'src/app/shared/services/habit.service';
import { Freqeuncy } from 'src/app/habit-tracker/enums/frequency';
import { IconColor } from 'src/app/habit-tracker/enums/icon-color';
import { IconImage } from 'src/app/habit-tracker/enums/icon-image';

@Component({
  selector: 'app-habit-edit',
  templateUrl: './habit-edit.component.html',
  styleUrls: ['./habit-edit.component.scss'],
})
export class HabitEditComponent implements OnInit {
  public newHabitForm = new FormGroup({});
  public enumFrequency = Freqeuncy;
  public enumIconColor = IconColor;
  public enumIconImage = IconImage;

  constructor(
    private formBuilder: FormBuilder,
    private habitService: HabitService
  ) {}

  ngOnInit(): void {
    this.newHabitForm = this.formBuilder?.group({
      habitName: [null, [Validators.required]],
      frequency: [null, [Validators.required]],
      countPerFreq: [
        null,
        [Validators.required, Validators.min(1), Validators.max(7)],
      ],
      iconImage: [null, [Validators.required]],
      iconColor: [null, [Validators.required]],
    });
  }

  onSaveHabit() {
    console.log(this.newHabitForm.value);
    this.habitService.addHabit(this.newHabitForm.value).subscribe();
    this.newHabitForm.reset();
  }

  onSelectRandIconImg() {
    const enumValues = Object.values(this.enumIconImage);
    let selectedImg = enumValues[Math.floor(Math.random() * enumValues.length)];
    this.newHabitForm.patchValue({
      iconImage: selectedImg,
    });
  }

  onSelectRandIconColor() {
    const enumValues = Object.values(this.enumIconColor);
    let selectedColor =
      enumValues[Math.floor(Math.random() * enumValues.length)];
    this.newHabitForm.patchValue({
      iconColor: selectedColor,
    });
  }
}
