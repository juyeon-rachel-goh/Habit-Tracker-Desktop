import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextfieldComponent } from './textfield/textfield.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [TextfieldComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [TextfieldComponent],
})
export class InputModule {}
