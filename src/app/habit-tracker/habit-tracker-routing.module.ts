// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { HabitDetailComponent } from './habit-detail/habit-detail.component';
// import { HabitEditComponent } from './habit-edit/habit-edit.component';
// import { HabitMoodSelectorComponent } from './habit-mood-selector/habit-mood-selector.component';
// import { HabitTableComponent } from './habit-table/habit-table.component';

// const signInRoutes: Routes = [
//   {
//     path: 'habit-tracker',
//     component: HabitTableComponent, // View Monthly Habit Tracker Table
//     //need authGuard here
//     children: [
//       {
//         path: '',
//         // The child route under the AdminComponent has a path and a
//         // children property but it's not using a component. This defines a component-less route.
//         children: [
//           { path: 'habit-new', component: HabitEditComponent }, // Add new habit
//           { path: 'habit-edit/:id', component: HabitEditComponent }, // Edit + Delete
//           { path: 'habit-detail/:id', component: HabitDetailComponent }, // View selected habit
//           { path: 'mood-selector/:id', component: HabitMoodSelectorComponent }, // Daily Mood Selector - grab id of Date?
//         ],
//       },
//     ],
//   },
// ];

// @NgModule({
//   imports: [RouterModule.forChild(signInRoutes)],
//   exports: [RouterModule],
// })
// export class HabitTrackerRoutingModule {}
