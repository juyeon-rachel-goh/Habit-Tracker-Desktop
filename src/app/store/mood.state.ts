import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { DeleteDailyMood, GetDailyMoods, UpsertDailyMood } from './mood.action';
import { MoodService } from '../shared/services/mood.service';
import { tap } from 'rxjs';
import { DailyMood } from '../shared/models/daily-mood';
import { patch, updateItem } from '@ngxs/store/operators';

export class DailyMoodInterface {
  dailyMoods?: DailyMood[];
}

// State = Class definition
@State<DailyMoodInterface>({
  name: 'mood',
  defaults: { dailyMoods: [] },
})
@Injectable()
export class MoodState {
  constructor(private moodService: MoodService) {}
  @Action(GetDailyMoods)
  getDailyMoods(ctx: StateContext<DailyMoodInterface>) {
    return this.moodService.getDailyMoods().pipe(
      tap((result) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          dailyMoods: result,
        });
      })
    );
  }

  @Action(UpsertDailyMood) //UPSERTING
  upsertDailyMood(
    ctx: StateContext<DailyMoodInterface>,
    { dailyMood }: UpsertDailyMood
  ) {
    return this.moodService.upsertMood(dailyMood).pipe(
      tap((result) => {
        ctx.setState(
          patch<DailyMoodInterface>({
            dailyMoods: updateItem<DailyMood>(
              (data) => data?.eventDate === result?.eventDate,
              patch({ mood: result?.mood })
            ),
          })
        );
      })
    );
  }

  @Action(DeleteDailyMood) //RESET button
  deleteDailyMood(
    ctx: StateContext<DailyMoodInterface>,
    { dailyMoodId }: DeleteDailyMood
  ) {
    return this.moodService.deleteMood(dailyMoodId).pipe(
      tap(() => {
        const state = ctx.getState();
        const filteredArray = state.dailyMoods?.filter(
          (item) => item.id !== dailyMoodId
        );
        ctx.setState({
          ...state,
          dailyMoods: filteredArray,
        });
      })
    );
  }

  @Selector()
  static dailyMoodList(state: DailyMoodInterface) {
    return state.dailyMoods;
  }
}
