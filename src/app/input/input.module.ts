import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextfieldComponent } from './textfield/textfield.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TextfieldComponent],
  imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule],
  exports: [TextfieldComponent],
})
export class InputModule {}
