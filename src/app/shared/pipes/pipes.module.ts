import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsFormControlPipe } from './as-form-control.pipe';
import { KeysPipe } from './key.pipe';
import { RangePipe } from './range.pipe';
import { GetDayPipe } from './get-day.pipe';
import { MoodImagePipe } from './mood-image.pipe';

@NgModule({
  declarations: [
    AsFormControlPipe,
    KeysPipe,
    RangePipe,
    GetDayPipe,
    MoodImagePipe,
  ],
  imports: [CommonModule],
  exports: [AsFormControlPipe, KeysPipe, RangePipe, GetDayPipe, MoodImagePipe],
})
export class PipesModule {}
