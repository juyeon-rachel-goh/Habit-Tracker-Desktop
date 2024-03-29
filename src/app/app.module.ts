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
import { StoreModule } from './store/store/store.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DailyRecordFunctions } from './shared/utility/dailyRecords';

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
    ReactiveFormsModule,
    LayoutModule,
    MatButtonModule,
    NgbModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    StoreModule,
  ],
  providers: [DailyRecordFunctions],
  bootstrap: [AppComponent],
})
export class AppModule {}
