import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';

interface AuthStateInterface {}

export interface DailyMood {}

// State = Class definition
@State<AuthStateInterface>({
  name: 'mood',
  defaults: {},
})
@Injectable()
export class MoodState {}
