import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Habit } from '../models/habit';
import { id } from 'date-fns/locale';
import { DailyHabitRecord } from '../models/daily-habit-record';
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY } from '@angular/cdk/overlay/overlay-directives';

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

  public getCompletionStatus(): Observable<DailyHabitRecord[]> {
    const url = `${this.url}/history`;
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

  public changeCompletionStatus(recordSource: any) {
    const url = `${this.url}/change-habit-record`;
    return this.http.put<DailyHabitRecord>(url, recordSource);
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
    console.log(patchObject);
    return this.http.patch(url, patchObject);
  }
}
