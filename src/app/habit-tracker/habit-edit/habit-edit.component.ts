import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-habit-edit',
  templateUrl: './habit-edit.component.html',
  styleUrls: ['./habit-edit.component.scss'],
})
export class HabitEditComponent implements OnInit {
  public iconColors = ['#0ead69', '#ffbe0b', '#d90429', '#072ac8', '#7b2cbf'];
  public iconImages = ['check', 'circle', 'star', 'favorite', 'thumb_up'];

  public newHabitForm = new FormGroup({});

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.newHabitForm = this.formBuilder?.group({
      habitName: [null, [Validators.required]],
      frequency: [null, [Validators.required]],
      iconImage: [null, [Validators.required]],
      iconColor: [null, [Validators.required]],
      createdOn: [null, [Validators.required]],
      completionStatus: [null, [Validators.required]],
      archivedStatus: [null, [Validators.required]],
    });
  }

  onSaveHabit() {
    // if habitname,frequency,iconimage,iconcolor has values -> patchvalue below than send HTTP request
    this.newHabitForm.patchValue({
      createdOn: Date(),
      completionStatus: [false],
      archivedStatus: [false],
    });
    console.log(this.newHabitForm);
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
