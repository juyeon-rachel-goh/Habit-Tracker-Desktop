import { Habit } from './habit';

export interface DailyHabitRecord {
  recordId?: string;
  date: Date;
  mood: string;
  habits?: Habit[];
}
