import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Habit } from '../models/habit';
import { id } from 'date-fns/locale';

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

  public deleteHabit(id: string) {
    console.log('delete habit service called!' + id);
    const url = `${this.url}/delete-habit/${id}`;
    return this.http.delete<Habit>(url);
  }

  public archiveHabit(value: string, id: string): Observable<Habit> {
    const url = `${this.url}/archive/${id}`;
    console.log(value);
    return this.http.patch<Habit>(url, value);
    // value = json object
  }
}
