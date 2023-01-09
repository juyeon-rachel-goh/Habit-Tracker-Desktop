import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HabitService } from 'src/app/services/habit.service';
import { Freqeuncy } from 'src/enums/frequency';

@Component({
  selector: 'app-habit-edit',
  templateUrl: './habit-edit.component.html',
  styleUrls: ['./habit-edit.component.scss'],
})
export class HabitEditComponent implements OnInit {
  public iconColors = ['#0ead69', '#ffbe0b', '#d90429', '#072ac8', '#7b2cbf'];
  public iconImages = ['check', 'circle', 'star', 'favorite', 'thumb_up'];

  public newHabitForm = new FormGroup({});
  public enumFrequency = Freqeuncy;

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
    // call service
    this.habitService.addHabit(this.newHabitForm.value);
    this.newHabitForm.reset();
  }

  onSelectRandIconImg() {
    let selectedImg =
      this.iconImages[Math.floor(Math.random() * this.iconImages.length)];
    this.newHabitForm.patchValue({
      iconImage: selectedImg,
    });
  }

  onSelectRandIconColor() {
    let selectedColor =
      this.iconColors[Math.floor(Math.random() * this.iconColors.length)];
    this.newHabitForm.patchValue({
      iconColor: selectedColor,
    });
  }
}
