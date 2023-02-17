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
import { HabitArchiveComponent } from './habit-archive/habit-archive.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  declarations: [
    HabitTableComponent,
    HabitEditComponent,
    HabitDetailComponent,
    HabitMoodSelectorComponent,
    HabitMainComponent,
    HabitArchiveComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatDividerModule,
    MatButtonModule,
    MatListModule,
    InputModule,
    PipesModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatSelectModule,
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
