import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { InputModule } from './input/input.module';
import { AuthModule } from './auth/auth.module';
import { PipesModule } from './shared/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from './layout/layout.module';
import { HomeComponent } from './home/home.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HabitTrackerModule } from './habit-tracker/habit-tracker.module';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from './store/auth.state';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { MoodState } from './store/mood.state';
import { HabitState } from './store/habit.state';
import { DailyHabitRecordState } from './store/daily-record.state';

@NgModule({
  declarations: [AppComponent, HomeComponent, ContactUsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    InputModule,
    HabitTrackerModule,
    PipesModule,
    HttpClientModule,
    LayoutModule,
    MatButtonModule,
    NgbModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxsModule.forRoot(
      [AuthState, MoodState, HabitState, DailyHabitRecordState],
      {
        developmentMode: false,
      }
    ),
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
