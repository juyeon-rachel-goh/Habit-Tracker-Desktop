import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HabitMainComponent } from './habit-main/habit-main.component';
import { HabitTableComponent } from './habit-table/habit-table.component';
import { HabitEditComponent } from './habit-edit/habit-edit.component';
import { HabitDetailComponent } from './habit-detail/habit-detail.component';
import { HabitMoodSelectorComponent } from './habit-mood-selector/habit-mood-selector.component';
import { InputModule } from '../input/input.module';
import { PipesModule } from '../shared/pipes/pipes.module';

import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgCircleProgressModule } from 'ng-circle-progress';

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
    ReactiveFormsModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatButtonModule,
    InputModule,
    PipesModule,
    MatButtonToggleModule,
    NgCircleProgressModule.forRoot({}),
  ],
  exports: [
    HabitTableComponent,
    HabitEditComponent,
    HabitDetailComponent,
    HabitMoodSelectorComponent,
  ],
})
export class HabitTrackerModule {}
