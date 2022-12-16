import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HabitTableComponent } from './habit-table/habit-table.component';
import { HabitEditComponent } from './habit-edit/habit-edit.component';
import { HabitDetailComponent } from './habit-detail/habit-detail.component';
import { HabitMoodSelectorComponent } from './habit-mood-selector/habit-mood-selector.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { HabitMainComponent } from './habit-main/habit-main.component';

@NgModule({
  declarations: [
    HabitTableComponent,
    HabitEditComponent,
    HabitDetailComponent,
    HabitMoodSelectorComponent,
    HabitMainComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
  ],
  exports: [
    HabitTableComponent,
    HabitEditComponent,
    HabitDetailComponent,
    HabitMoodSelectorComponent,
  ],
})
export class HabitTrackerModule {}
