import {
  addDays,
  addMonths,
  addWeeks,
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  endOfDay,
  endOfMonth,
  endOfWeek,
  getDaysInMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  sub,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';
import { Frequency } from 'src/app/habit-tracker/enums/frequency';
import { StreakCalculation } from './dailyRecords.interface';

export class DailyRecordFunctions implements StreakCalculation {
  public delta(frequency: Frequency, date: Date): number {
    /// Delta function TEST COMPLETE!
    switch (frequency) {
      case Frequency.Day: {
        return 1;
      }
      case Frequency.Week: {
        return 7;
      }
      case Frequency.Month: {
        return getDaysInMonth(date);
      }
      default:
        return 0;
    }
  }

  public findBeginningofInterval(frequency: Frequency, date: Date): Date {
    switch (frequency) {
      case Frequency.Day: {
        return startOfDay(date);
      }
      case Frequency.Week: {
        return startOfWeek(date, { weekStartsOn: 1 });
      }
      case Frequency.Month: {
        return startOfMonth(date);
      }
      default:
        return date;
    }
  }

  public maxStreaks(
    frequency: Frequency,
    endDate: Date,
    startDate: Date
  ): number {
    switch (frequency) {
      case Frequency.Day: {
        return differenceInDays(addDays(endDate, 1), startDate);
      }
      case Frequency.Week: {
        const endDateOfCurrentWeek = endOfWeek(endDate, { weekStartsOn: 1 });
        return differenceInWeeks(endDateOfCurrentWeek, startDate, {
          roundingMethod: 'ceil',
        });
      }
      case Frequency.Month: {
        let startOfNextMonth = startOfMonth(addMonths(endDate, 1));
        return differenceInMonths(startOfNextMonth, startDate);
      }
      default:
        return 0;
    }
  }

  public findStartDateofCurrentStreak(
    frequency: Frequency,
    date: Date,
    streak: number
  ): Date {
    switch (frequency) {
      case Frequency.Day: {
        return subDays(date, streak);
      }
      case Frequency.Week: {
        return subWeeks(date, streak);
      }
      case Frequency.Month: {
        return subMonths(date, streak);
      }
      default:
        return date;
    }
  }

  public findEndDateofCurrentStreak(
    frequency: Frequency,
    date: Date,
    streak: number
  ): Date {
    switch (frequency) {
      case Frequency.Day: {
        let startDate = this.findStartDateofCurrentStreak(
          frequency,
          date,
          streak
        );
        return sub(addDays(startDate, streak), { seconds: 1 });
      }
      case Frequency.Week: {
        let startDate = this.findStartDateofCurrentStreak(
          frequency,
          date,
          streak
        );
        return sub(addWeeks(startDate, streak), { seconds: 1 });
      }
      case Frequency.Month: {
        let startDate = this.findStartDateofCurrentStreak(
          frequency,
          date,
          streak
        );
        return sub(addMonths(startDate, streak), { seconds: 1 });
      }
      default:
        return date;
    }
  }

  public findEndDateofCurrentInterval(frequency: Frequency, date: Date): Date {
    switch (frequency) {
      case Frequency.Day: {
        return endOfDay(date);
      }
      case Frequency.Week: {
        return endOfWeek(date, {
          weekStartsOn: 1,
        });
      }
      case Frequency.Month: {
        return endOfMonth(date);
      }
      default:
        return date;
    }
  }
}
