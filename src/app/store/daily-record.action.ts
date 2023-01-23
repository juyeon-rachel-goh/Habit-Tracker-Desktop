import { DailyHabitRecord } from '../shared/models/daily-habit-record';

export class GetDailyRecords {
  static readonly type = '[Record] Get DailyRecords';
  constructor() {}
}

export class ChangeDailyRecords {
  static readonly type = '[Record] Update DailyRecord';
  constructor(public record: DailyHabitRecord) {}
}
