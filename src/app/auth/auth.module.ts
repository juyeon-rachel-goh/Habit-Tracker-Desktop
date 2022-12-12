import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { RegisterComponent } from './register/register.component';
import { InputModule } from '../input/input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [RegisterComponent, SignInComponent],
  imports: [
    CommonModule,
    InputModule,
    ReactiveFormsModule,
    PipesModule,
    MatButtonModule,
  ],
})
export class AuthModule {}
