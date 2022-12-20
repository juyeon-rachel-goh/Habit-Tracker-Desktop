export interface Habit {
  habitId?: string;
  habitName: string;
  frequency: number;
  iconColor: string;
  iconImage: string;
  createdOn: number;
  completionStatus: boolean;
  archivedStatus: boolean;
}
