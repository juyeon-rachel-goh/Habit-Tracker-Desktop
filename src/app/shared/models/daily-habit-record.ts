import { Habit } from './habit';

export interface DailyHabitRecord {
  id?: string;
  date: string;
  completionStatus?: boolean; // habit done or not
  habitId?: string;
  habit?: Habit;
}
