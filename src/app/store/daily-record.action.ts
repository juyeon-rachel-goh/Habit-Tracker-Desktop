import { DailyHabitRecord } from '../shared/models/daily-habit-record';

export class GetDailyRecords {
  static readonly type = '[Record] Get DailyRecords';
  constructor() {}
}
export class AddRecord {
  static readonly type = '[Record] Add Record';
  constructor(public record: DailyHabitRecord) {}
}

export class DeleteLastRecord {
  static readonly type = '[Record] Delete Last Record';
  constructor(public id: string) {}
}

export class ChangeCompletionStatus {
  static readonly type = '[Record] Update CompletionStatus';
  constructor(public record: DailyHabitRecord) {}
}
