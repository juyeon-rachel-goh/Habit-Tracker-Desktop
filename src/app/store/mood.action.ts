import { DailyMood } from '../shared/models/daily-mood';

export class GetDailyMoods {
  static readonly type = '[Mood] Get DailyMoods';
  constructor() {}
}

export class UpsertDailyMood {
  static readonly type = '[Mood] Update DailyMoods';
  constructor(public dailyMood: DailyMood) {}
}

export class DeleteDailyMood {
  static readonly type = '[Mood] Delete DailyMoods';
  constructor(public dailyMoodId: string) {}
}
