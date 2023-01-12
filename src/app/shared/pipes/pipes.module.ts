import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsFormControlPipe } from './as-form-control.pipe';
import { KeysPipe } from './key.pipe';
import { RangePipe } from './range.pipe';

@NgModule({
  declarations: [AsFormControlPipe, KeysPipe, RangePipe],
  imports: [CommonModule],
  exports: [AsFormControlPipe, KeysPipe, RangePipe],
})
export class PipesModule {}
