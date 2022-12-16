import { Habit } from './habit';

export interface DailyHabitRecord {
  recordId?: string;
  date: string;
  moodSelector: string;
  habits?: Habit[];
}
