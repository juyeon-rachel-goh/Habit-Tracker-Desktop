import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DailyMood } from '../models/daily-mood';

@Injectable({
  providedIn: 'root',
})
export class MoodService {
  private url = 'http://localhost:4200/api/habit-tracker';
  constructor(private http: HttpClient) {}

  //   public getMoods(): Observable<Habit[]> {
  //     return this.http.get<Habit[]>(this.url);
  //   }

  public updateMood(mood: DailyMood): Observable<DailyMood> {
    console.log(mood);
    const url = `${this.url}` + '/update-mood';
    console.log(url);
    return this.http.put<DailyMood>(url, mood);
  }

  //   public updateMood(habit: Habit): Observable<Habit> {
  //     const url = `${this.url}`;
  //     return this.http.post<Habit>(url, habit);
  //   }
}
