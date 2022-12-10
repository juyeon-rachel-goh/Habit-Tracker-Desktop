import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { ContactUsComponent } from './body/contact-us/contact-us.component';
import { AddEditItemComponent } from './body/habit-tracker/add-edit-item/add-edit-item.component';
import { HabitTrackerComponent } from './body/habit-tracker/habit-tracker.component';
import { HomeComponent } from './body/home/home.component';

const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
  },
  { path: 'contact', component: ContactUsComponent },
  { path: 'habit-tracker', component: HabitTrackerComponent },
  { path: 'new', component: AddEditItemComponent },
  { path: 'edit/:id', component: AddEditItemComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
