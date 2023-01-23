import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';
import { patch, updateItem } from '@ngxs/store/operators';
import { Habit } from '../shared/models/habit';
import { HabitService } from '../shared/services/habit.service';
import { DeleteHabit, GetHabits } from './habit.action';

export class HabitInterface {
  habits?: Habit[];
}

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
  //   @Action(UpdateDailyMood) //UPSERTING
  //   updateDailyMood(ctx: StateContext<DailyMoodInterface>) {}

  @Action(DeleteHabit)
  deleteDailyMood(ctx: StateContext<HabitInterface>, { habitId }: DeleteHabit) {
    return this.habitService.deleteHabit(habitId).pipe(
      tap(() => {
        const state = ctx.getState();
        const filteredArray = state.habits?.filter(
          (item) => item.id !== habitId
        );
        ctx.setState({
          ...state,
          habits: filteredArray,
        });
      })
    );
  }

  @Selector()
  static getHabitbyId(state: HabitInterface) {
    return (habitId: string) => {
      return state.habits!.find((habit: Habit) => habit.id === habitId);
    };
  }

  @Selector()
  static habitsList(state: HabitInterface) {
    return state.habits;
  }
}
