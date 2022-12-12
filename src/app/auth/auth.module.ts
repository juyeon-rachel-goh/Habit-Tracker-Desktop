import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { RegisterComponent } from './register/register.component';
import { InputModule } from '../input/input.module';

@NgModule({
  declarations: [RegisterComponent, SignInComponent],
  imports: [CommonModule, InputModule],
})
export class AuthModule {}
