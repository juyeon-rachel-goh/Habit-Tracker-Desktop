import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HabitTableComponent } from './habit-table/habit-table.component';
import { HabitEditComponent } from './habit-edit/habit-edit.component';
import { HabitDetailComponent } from './habit-detail/habit-detail.component';
import { HabitMoodSelectorComponent } from './habit-mood-selector/habit-mood-selector.component';
import { HabitTrackerRoutingModule } from './habit-tracker-routing.module';

@NgModule({
  declarations: [
    HabitTableComponent,
    HabitEditComponent,
    HabitDetailComponent,
    HabitMoodSelectorComponent,
  ],
  imports: [CommonModule, HabitTrackerRoutingModule],
})
export class HabitTrackerModule {}
