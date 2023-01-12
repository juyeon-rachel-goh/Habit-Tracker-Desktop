//data sharing between components //
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DailyMood } from '../models/daily-mood';

@Injectable({
  providedIn: 'root',
})
export class HabitDataService {
  private dailyMoodCollection = new Array<DailyMood>();
  private dailyMoodData = new BehaviorSubject<Array<DailyMood>>([]);
  public dailyMood = this.dailyMoodData.asObservable();

  constructor() {}

  public setMood(mood: DailyMood) {
    // overwrite if eventIndex already exist
    // when fully implemented, eventIndex -> eventDate. Data will be unique
    this.dailyMoodCollection.push(mood);
    this.dailyMoodData.next(this.dailyMoodCollection);
  }
}
