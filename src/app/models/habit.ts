export interface Habit {
  habitId?: string;
  habitName: string;
  frequency: number;
  iconColor: string;
  iconImage: string;
  createdOn: Date;
  completionStatus: boolean;
  archivedStatus: boolean;
}
