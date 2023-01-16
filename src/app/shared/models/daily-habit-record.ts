import { Habit } from './habit';

export interface DailyHabitRecord {
  recordId?: string;
  date: Date;
  completionStatus: boolean; // habit done or not
  habit?: Habit;
}
