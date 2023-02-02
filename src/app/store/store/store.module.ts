import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from '../auth.state';
import { DailyHabitRecordState } from '../daily-record.state';
import { HabitState } from '../habit.state';
import { MoodState } from '../mood.state';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxsModule.forRoot(
      [AuthState, MoodState, HabitState, DailyHabitRecordState],
      {
        developmentMode: false,
      }
    ),
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ],
})
export class StoreModule {}
