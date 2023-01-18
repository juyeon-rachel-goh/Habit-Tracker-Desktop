import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { GetDailyMoods, UpdateDailyMood } from './mood.action';
import { MoodService } from '../shared/services/mood.service';
import { iif, tap } from 'rxjs';
import { DailyMood } from '../shared/models/daily-mood';
import { Mood } from '../habit-tracker/enums/mood';
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

  @Action(UpdateDailyMood) //UPSERTING
  updateDailyMoods(
    ctx: StateContext<DailyMoodInterface>,
    { dailyMood }: UpdateDailyMood
  ) {
    return this.moodService.updateMood(dailyMood).pipe(
      tap((result) => {
        ctx.setState(
          patch<DailyMoodInterface>({
            dailyMoods: updateItem<DailyMood>(
              (data) => data?.eventDate === result.eventDate,
              patch({ mood: result.mood })
            ),
          })
        );
      })
    );
  }

  @Selector()
  static dailyMoodList(state: DailyMoodInterface) {
    return state.dailyMoods;
  }

  // private insertOrUpdateDailyMood(dailyMood?: DailyMood) {
  //   return iif<DailyMood[]>(
  //     (dailyMoodList) => dailyMoodList.some((contract) => contract.id === id),
  //     updateItem((contract) => contract.id === id, patch(loadedContract)),
  //     insertItem(loadedContract)
  //   );
  // }
}
