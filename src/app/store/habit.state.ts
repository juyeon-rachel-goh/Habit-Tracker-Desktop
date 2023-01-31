import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';
import { patch, updateItem } from '@ngxs/store/operators';
import { Habit } from '../shared/models/habit';
import { HabitService } from '../shared/services/habit.service';
import {
  ArchiveHabit,
  DeleteHabit,
  GetHabits,
  UpsertHabit,
} from './habit.action';
import { produce } from 'immer';
export class HabitInterface {
  habits: Habit[] = [];
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

  @Action(UpsertHabit)
  upsertHabit(ctx: StateContext<HabitInterface>, { habit }: UpsertHabit) {
    return this.habitService.upsertHabit(habit).pipe(
      tap(() => {
        const state = produce(ctx.getState(), (draft) => {
          // draft = copy of state
          const index = draft.habits.findIndex((data) => data.id === habit.id);
          // It exists then let's update
          if (index > -1) {
            draft.habits[index] = habit;
          } else {
            draft.habits.push(habit);
          }
        });
        ctx.setState(state);
      })
    );
  }

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

  @Action(ArchiveHabit)
  archiveHabit(
    ctx: StateContext<HabitInterface>,
    { status, habitId }: ArchiveHabit
  ) {
    return this.habitService.archiveHabit(status, habitId).pipe(
      tap(() => {
        const state = produce(ctx.getState(), (draft) => {
          // draft = copy of state
          const index = draft.habits.findIndex((data) => data.id === habitId);
          draft.habits[index].archiveStatus = status;
        });
        ctx.setState(state);
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
