import { Habit } from '../shared/models/habit';

export class GetHabits {
  static readonly type = '[Habit] Get Habits';
  constructor() {}
}

// export class GetHabitbyId {
//   static readonly type = '[Habit] Get Habit by Id';
//   constructor() {}
// }

export class AddHabit {
  static readonly type = '[Habit] Add Habit';
  constructor(public habit: Habit) {}
}

export class UpdateHabit {
  static readonly type = '[Habit] Update Habit';
  constructor(public habit: Habit) {}
} // update contents, archieve status etc

export class DeleteHabit {
  static readonly type = '[Habit] Delete Habit';
  constructor(public habitId: string) {}
}
