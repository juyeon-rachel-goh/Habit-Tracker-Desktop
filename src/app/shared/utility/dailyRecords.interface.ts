import { Frequency } from 'src/app/habit-tracker/enums/frequency';

export interface StreakCalculation {
  delta(frequency: Frequency, date: Date): number;
  findBeginningofInterval(frequency: Frequency, date: Date): Date;
  maxStreaks(frequency: Frequency, endDate: Date, startDate: Date): number;
  findStartDateofCurrentStreak(
    frequency: Frequency,
    date: Date,
    streak: number
  ): Date;
  findEndDateofCurrentStreak(
    frequency: Frequency,
    date: Date,
    streak: number
  ): Date;
  findEndDateofCurrentInterval(frequency: Frequency, date: Date): Date;
}
