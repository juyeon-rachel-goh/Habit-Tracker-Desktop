import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
      habitName: ['', [Validators.required]],
      iconColor: [''],
    });
  }

  onSaveHabit() {}
  onSelectRandElement(arr: string[]) {
    let selectedItem = arr[Math.floor(Math.random() * arr.length)];
    console.log(selectedItem);
    // save this result to newHabitForm.iconColor or iconImage
  }
}
