import { Freqeuncy } from 'src/app/habit-tracker/enums/frequency';

export interface Habit {
  id?: string;
  habitName: string;
  frequency: Freqeuncy;
  countPerFreq: number;
  iconColor: string;
  iconImage: string;
  createdOn: Date;
  archiveStatus: boolean;
}
