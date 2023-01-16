import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsFormControlPipe } from './as-form-control.pipe';
import { KeysPipe } from './key.pipe';
import { RangePipe } from './range.pipe';
import { GetDayPipe } from './get-day.pipe';

@NgModule({
  declarations: [AsFormControlPipe, KeysPipe, RangePipe, GetDayPipe],
  imports: [CommonModule],
  exports: [AsFormControlPipe, KeysPipe, RangePipe, GetDayPipe],
})
export class PipesModule {}
