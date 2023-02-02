import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Habit } from '../models/habit';
import { DailyHabitRecord } from '../models/daily-habit-record';

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

  public getDailyRecords(): Observable<DailyHabitRecord[]> {
    const url = `${this.url}/records`;
    return this.http.get<DailyHabitRecord[]>(url);
  }

  public upsertHabit(habit: Habit) {
    const url = `${this.url}/upsert-habit`;
    return this.http.put<Habit>(url, habit);
  }

  public deleteHabit(id: string) {
    const url = `${this.url}/delete-habit/${id}`;
    return this.http.delete<Habit>(url);
  }

  public addDailyRecord(record: DailyHabitRecord) {
    const url = `${this.url}/records/complete`;
    return this.http.post<DailyHabitRecord>(url, record);
  }

  public deleteDailyRecord(id: string) {
    const url = `${this.url}/records/delete/${id}`;
    return this.http.delete<DailyHabitRecord>(url);
  }

  public archiveHabit(value: boolean, id: string) {
    const url = `${this.url}/archive/${id}`;
    // send over true or false instead of patch doc
    const patchObject = [
      {
        op: 'replace',
        path: '/archiveStatus',
        value: value,
      },
    ];
    return this.http.patch(url, patchObject);
  }
}
