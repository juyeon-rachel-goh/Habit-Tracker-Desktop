import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';
import {
  AddRecord,
  DeleteLastRecord,
  GetDailyRecords,
} from './daily-record.action';
import { DailyHabitRecord } from '../shared/models/daily-habit-record';
import { HabitService } from '../shared/services/habit.service';

export class DailyCompletionStatusInterface {
  dailyRecords?: DailyHabitRecord[];
}

@State<DailyCompletionStatusInterface>({
  name: 'record',
  defaults: { dailyRecords: [] },
})
@Injectable()
export class DailyHabitRecordState {
  constructor(private habitService: HabitService) {}

  @Action(GetDailyRecords)
  getDailyRecords(ctx: StateContext<DailyCompletionStatusInterface>) {
    return this.habitService.getDailyRecords().pipe(
      tap((result) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          dailyRecords: result,
        });
      })
    );
  }

  @Action(AddRecord) // Keep pushing record (no replace)
  addRecord(
    ctx: StateContext<DailyCompletionStatusInterface>,
    { record }: AddRecord
  ) {
    return this.habitService.addDailyRecord(record).pipe(
      tap((result) => {
        const state = ctx.getState();
        ctx.patchState({
          dailyRecords: [...state.dailyRecords!, result],
        });
      })
    );
  }

  @Action(DeleteLastRecord)
  deleteLastRecord(
    ctx: StateContext<DailyCompletionStatusInterface>,
    { id }: DeleteLastRecord
  ) {
    return this.habitService.deleteDailyRecord(id);
  }

  @Selector()
  static dailyCompletionStatus(state: DailyCompletionStatusInterface) {
    return state.dailyRecords;
  }
}
