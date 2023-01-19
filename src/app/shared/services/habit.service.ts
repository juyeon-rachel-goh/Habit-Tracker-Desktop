import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Habit } from '../models/habit';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  private url = 'http://localhost:4200/api/habit-tracker';
  constructor(private http: HttpClient) {}

  public getHabits(): Observable<Habit[]> {
    const url = `${this.url}/habits`;
    return this.http.get<Habit[]>(url);
  }

  public addHabit(habit: Habit): Observable<Habit> {
    const url = `${this.url}/new-habit`;
    return this.http.post<Habit>(url, habit);
  }
}
