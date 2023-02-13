import { Frequency } from 'src/app/habit-tracker/enums/frequency';

export interface Habit {
  id?: string;
  habitName: string;
  frequency: Frequency;
  countPerFreq: number;
  iconColor: string;
  createdOn: Date;
  archiveStatus: boolean;
}
