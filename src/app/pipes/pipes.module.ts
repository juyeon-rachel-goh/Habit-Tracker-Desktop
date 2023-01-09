import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsFormControlPipe } from './as-form-control.pipe';
import { KeysPipe } from './key.pipe';

@NgModule({
  declarations: [AsFormControlPipe, KeysPipe],
  imports: [CommonModule],
  exports: [AsFormControlPipe, KeysPipe],
})
export class PipesModule {}
