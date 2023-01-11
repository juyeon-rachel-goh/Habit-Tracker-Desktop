import { Freqeuncy } from 'src/app/habit-tracker/enums/frequency';

export interface Habit {
  habitId?: string;
  habitName: string;
  frequency: Freqeuncy;
  countPerFreq: number;
  iconColor: string;
  iconImage: string;
  // delete below??
  createdOn: Date;
  completionStatus: boolean;
  archivedStatus: string;
}
