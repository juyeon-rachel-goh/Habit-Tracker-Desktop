import { Habit } from '../shared/models/habit';

export class GetHabits {
  static readonly type = '[Habit] Get Habits';
  constructor() {}
}

export class UpsertHabit {
  static readonly type = '[Mood] Upsert Habit';
  constructor(public habit: Habit) {}
}

export class DeleteHabit {
  static readonly type = '[Habit] Delete Habit';
  constructor(public habitId: string) {}
}

export class ArchiveHabit {
  static readonly type = '[Habit] Archive Habit';
  constructor(public status: boolean, public habitId: string) {}
}
