import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DailyMood } from '../models/daily-mood';

@Injectable({
  providedIn: 'root',
})
export class MoodService {
  private url = 'api/habit-tracker';
  constructor(private http: HttpClient) {}

  public getDailyMoods(): Observable<DailyMood[]> {
    const url = `${this.url}/mood`;
    return this.http.get<DailyMood[]>(url);
  }

  //Upserting
  public upsertMood(dailyMood: DailyMood) {
    const url = `${this.url}/mood/upsert`;
    return this.http.put<DailyMood>(url, dailyMood);
  }

  public deleteMood(id: string) {
    const url = `${this.url}/mood/delete/${id}`;
    return this.http.delete<DailyMood[]>(url);
  }
}
