import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { GetDailyMoods } from './mood.action';
import { MoodService } from '../shared/services/mood.service';
import { tap } from 'rxjs';
import { DailyMood } from '../shared/models/daily-mood';

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

  @Selector()
  static dailyMoodList(state: DailyMoodInterface) {
    return state.dailyMoods;
  }
}
