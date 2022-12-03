import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HabitTrackerComponent } from './habit-tracker/habit-tracker.component';
import { HomeComponent } from './home/home.component';
import { AppModule } from '../app.module';

@NgModule({
  declarations: [HomeComponent, HabitTrackerComponent, ContactUsComponent],
  imports: [AppModule, CommonModule, RouterModule],
  exports: [HomeComponent, HabitTrackerComponent, ContactUsComponent],
})
export class ContactsModule {}
