import { TextfieldComponent } from './textfield/textfield.component';
import { IconSelectorComponent } from './icon-selector/icon-selector.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [TextfieldComponent, IconSelectorComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [TextfieldComponent, IconSelectorComponent],
})
export class InputModule {}
