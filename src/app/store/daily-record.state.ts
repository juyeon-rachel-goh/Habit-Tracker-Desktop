// daily record - completion status
// GET & ADD or Update only  = upserting (no deletion)
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';
import { ChangeCompletionStatus, GetDailyRecords } from './daily-record.action';
import { DailyHabitRecord } from '../shared/models/daily-habit-record';
import { HabitService } from '../shared/services/habit.service';
import { patch, updateItem } from '@ngxs/store/operators';

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
    return this.habitService.getCompletionStatus().pipe(
      tap((result) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          dailyRecords: result,
        });
      })
    );
  }

  @Action(ChangeCompletionStatus) //UPSERTING
  changeCompletionStatus(
    ctx: StateContext<DailyCompletionStatusInterface>,
    { record }: ChangeCompletionStatus
  ) {
    return this.habitService.changeCompletionStatus(record).pipe(
      tap((result) => {
        ctx.setState(
          patch<DailyCompletionStatusInterface>({
            dailyRecords: updateItem<DailyHabitRecord>(
              (data) =>
                data?.date === result?.date && data.habitId === result.habitId,
              patch({ completionStatus: result?.completionStatus })
            ),
          })
        );
      })
    );
  }

  @Selector()
  static dailyCompletionStatus(state: DailyCompletionStatusInterface) {
    return state.dailyRecords;
  }
}
