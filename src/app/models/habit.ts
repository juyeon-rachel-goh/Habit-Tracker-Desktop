export interface Habit {
  habitId?: string;
  name: string;
  frequency: number;
  iconColor: string;
  iconImage: string;
  createdOn: number;
  completionStatus: boolean;
  archivedStatus: boolean;
}
