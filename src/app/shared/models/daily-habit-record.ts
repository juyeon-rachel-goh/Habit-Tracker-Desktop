import { Habit } from './habit';

export interface DailyHabitRecord {
  id?: string;
  date: string;
  habitId?: string;
  habit?: Habit;
}
