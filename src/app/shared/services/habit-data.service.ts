//data sharing between components //
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DailyMood } from '../models/daily-mood';

@Injectable({
  providedIn: 'root',
})
export class HabitDataService {
  private selectedMoodData = new BehaviorSubject<any>(null);
  public selectedMood = this.selectedMoodData.asObservable();
  constructor() {}

  public setMood(mood: any) {
    this.selectedMoodData.next(mood);
  }
}
