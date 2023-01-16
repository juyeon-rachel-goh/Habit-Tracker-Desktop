import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { SetDailyMood } from './mood.action';

interface MoodStateInterface {
  dailyMood?: DailyMood;
}

export interface DailyMood {
  id?: string;
  eventDate: string;
  mood: string;
}

// State = Class definition
@State<MoodStateInterface>({
  name: 'mood',
  defaults: {},
})
@Injectable()
export class MoodState {
  @Action(SetDailyMood)
  setDailyMood(ctx: StateContext<MoodStateInterface>) {}
}
