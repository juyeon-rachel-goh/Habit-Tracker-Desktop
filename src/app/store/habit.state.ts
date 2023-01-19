import { Injectable } from '@angular/core';
import {
  Action,
  Selector,
  State,
  StateContext,
  createSelector,
} from '@ngxs/store';
import { tap } from 'rxjs';
import { patch, updateItem } from '@ngxs/store/operators';
import { Habit } from '../shared/models/habit';
import { HabitService } from '../shared/services/habit.service';
import { GetHabits } from './habit.action';

export class HabitInterface {
  habits?: Habit[];
}

// State = Class definition
@State<HabitInterface>({
  name: 'habit',
  defaults: { habits: [] },
})
@Injectable()
export class HabitState {
  constructor(private habitService: HabitService) {}

  @Action(GetHabits)
  getHabits(ctx: StateContext<HabitInterface>) {
    return this.habitService.getHabits().pipe(
      tap((result) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          habits: result,
        });
      })
    );
  }

  // static getHabitbyId(habitId: string) {
  //   return createSelector([HabitState], (state: HabitInterface) => {
  //     return state.habits!.filter((habit: Habit) => habit.id === habitId);
  //   });
  // }
  @Selector()
  static getHabitbyId(state: HabitInterface) {
    return (habitId: string) => {
      return state.habits!.filter((habit: Habit) => habit.id === habitId);
    };
  }
  //   @Action(UpdateDailyMood) //UPSERTING
  //   updateDailyMood(ctx: StateContext<DailyMoodInterface>) {}

  //   @Action(DeleteDailyMood) //RESET button
  //   deleteDailyMood(ctx: StateContext<DailyMoodInterface>) {}

  @Selector()
  static habitsList(state: HabitInterface) {
    return state.habits;
  }

  @Selector()
  static archivedHabits(state: HabitInterface) {
    // return archivedHabits only
  }
}
