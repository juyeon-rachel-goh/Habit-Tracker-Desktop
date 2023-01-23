import { DailyHabitRecord } from '../shared/models/daily-habit-record';

export class GetDailyRecords {
  static readonly type = '[Record] Get DailyRecords';
  constructor() {}
}

export class ChangeCompletionStatus {
  static readonly type = '[Record] Update CompletionStatus';
  constructor(public record: DailyHabitRecord) {}
}
