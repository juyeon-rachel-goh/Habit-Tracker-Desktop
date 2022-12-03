import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactUsComponent } from './body/contact-us/contact-us.component';
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
  // // { path: 'details/:id', component:  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
