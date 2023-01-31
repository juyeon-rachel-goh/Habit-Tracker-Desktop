import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HomeComponent } from './home/home.component';
import { HabitTableComponent } from './habit-tracker/habit-table/habit-table.component';
import { HabitEditComponent } from './habit-tracker/habit-edit/habit-edit.component';
import { HabitDetailComponent } from './habit-tracker/habit-detail/habit-detail.component';
import { HabitMoodSelectorComponent } from './habit-tracker/habit-mood-selector/habit-mood-selector.component';
import { HabitMainComponent } from './habit-tracker/habit-main/habit-main.component';
import { AuthGuard } from './guards/auth.guard';
import { DailyMoodsResolverService } from './shared/services/daily-moods-resolver.service';
import { CompletionStatusResolver } from './shared/services/completion-status.resolver';
import { HabitListResolver } from './shared/services/habit-list.resolver';
import { HabitArchiveComponent } from './habit-tracker/habit-archive/habit-archive.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
  },
  { path: 'register', component: RegisterComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'contact-us', component: ContactUsComponent },
  {
    path: 'habit-tracker',
    component: HabitMainComponent, // this is the component with the <router-outlet> in the template
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        children: [
          {
            path: '',
            component: HabitTableComponent,
            resolve: {
              dailyMood: DailyMoodsResolverService,
              dailyRecord: CompletionStatusResolver,
              habitList: HabitListResolver,
            },
          },
          { path: 'new', component: HabitEditComponent }, // Add new habit
          { path: 'edit/:id', component: HabitEditComponent }, // Edit + Delete
          { path: 'detail/:id', component: HabitDetailComponent }, // View selected habit
          { path: 'archive', component: HabitArchiveComponent },
          {
            path: 'mood-selector/:id',
            component: HabitMoodSelectorComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
