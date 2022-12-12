import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AddEditItemComponent } from './habit-tracker/add-edit-item/add-edit-item.component';
import { HabitDetailComponent } from './habit-tracker/habit-detail/habit-detail.component';
import { HabitTrackerComponent } from './habit-tracker/habit-tracker.component';
import { HomeComponent } from './home/home.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [
    HomeComponent,
    HabitTrackerComponent,
    ContactUsComponent,
    AddEditItemComponent,
    HabitDetailComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatRadioModule,
  ],
  exports: [
    HomeComponent,
    HabitTrackerComponent,
    ContactUsComponent,
    AddEditItemComponent,
    HabitDetailComponent,
  ],
})
export class BodyModule {}
