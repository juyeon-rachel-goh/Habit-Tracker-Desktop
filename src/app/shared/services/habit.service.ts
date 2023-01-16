import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Habit } from '../models/habit';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  private url = 'http://localhost:4200/api/habit-tracker';
  constructor(private http: HttpClient) {}

  public getHabits(): Observable<Habit[]> {
    return this.http.get<Habit[]>(this.url);
  }

  public addHabit(habit: Habit): Observable<Habit> {
    const url = `${this.url}`;
    return this.http.post<Habit>(url, habit);
  }
}
