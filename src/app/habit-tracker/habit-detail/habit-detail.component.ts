import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-habit-detail',
  templateUrl: './habit-detail.component.html',
  styleUrls: ['./habit-detail.component.scss'],
})
export class HabitDetailComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  onArchive() {}

  onDelete() {
    // ask are you sure you want to delete this? All history and data will be deleted from server
    // if yes, call service to delete and pass
    // if no, back out (route.navigate(['../']))
  }
}
