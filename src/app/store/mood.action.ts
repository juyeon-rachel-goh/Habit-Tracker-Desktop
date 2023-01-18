import { DailyMood } from '../shared/models/daily-mood';

export class GetDailyMoods {
  static readonly type = '[Mood] Get DailyMoods';
  constructor() {}
}

export class UpdateDailyMood {
  static readonly type = '[Mood] Update DailyMoods';
  constructor(public dailyMood: DailyMood) {}
}
