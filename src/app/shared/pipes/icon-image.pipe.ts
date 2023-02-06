import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { format } from 'date-fns';
import { DailyHabitRecordState } from 'src/app/store/daily-record.state';
import { HabitState } from 'src/app/store/habit.state';

@Pipe({
  name: 'iconImage',
})
export class IconImagePipe implements PipeTransform {
  constructor(private store: Store) {}

  transform(
    year: number,
    month: number,
    date: number,
    habitId: string
  ): boolean {
    const eventDate = format(new Date(year, month, date), 'yyyy/MM/dd');
    // access to the selector w/o subscribing
    const statusReport = this.store.selectSnapshot(
      DailyHabitRecordState.dailyCompletionStatus
    );
    const habit = this.store
      .selectSnapshot(HabitState.habitsList)
      ?.find((item) => item.id === habitId)!;
    const result = statusReport?.find(
      (item) => item.date === eventDate && item.habitId === habitId
    );
    if (result?.completionStatus) {
      return true;
    } else {
      return false;
    }
  }
}
