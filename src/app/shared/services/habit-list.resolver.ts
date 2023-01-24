import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetHabits } from 'src/app/store/habit.action';

@Injectable({
  providedIn: 'root',
})
export class HabitListResolver implements Resolve<void> {
  constructor(private store: Store) {}
  resolve(): Observable<void> {
    return this.store.dispatch(new GetHabits());
  }
}
