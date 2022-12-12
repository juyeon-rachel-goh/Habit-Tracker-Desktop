import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsFormControlPipe } from './as-form-control.pipe';

@NgModule({
  declarations: [AsFormControlPipe],
  imports: [CommonModule],
  exports: [AsFormControlPipe],
})
export class PipesModule {}
