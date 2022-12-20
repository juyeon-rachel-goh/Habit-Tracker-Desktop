import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-habit-edit',
  templateUrl: './habit-edit.component.html',
  styleUrls: ['./habit-edit.component.scss'],
})
export class HabitEditComponent implements OnInit {
  public newHabitForm = new FormGroup({});

  constructor() {}

  ngOnInit(): void {}

  onSaveHabit() {}
}
