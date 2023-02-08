import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../shared/pipes/pipes.module';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { InputModule } from '../input/input.module';
import { LayoutModule } from '../layout/layout.module';

@NgModule({
  declarations: [RegisterComponent, SignInComponent],
  imports: [
    CommonModule,
    InputModule,
    ReactiveFormsModule,
    PipesModule,
    MatButtonModule,
    MatInputModule,
    LayoutModule,
  ],
})
export class AuthModule {}
