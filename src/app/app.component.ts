import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetUserInfo } from './store/auth.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Habit Tracker';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new SetUserInfo());
  }
}
