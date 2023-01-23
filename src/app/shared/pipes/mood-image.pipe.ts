import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { format } from 'date-fns';
import { MoodState } from 'src/app/store/mood.state';

@Pipe({
  name: 'moodImage',
})
export class MoodImagePipe implements PipeTransform {
  constructor(private store: Store) {}

  transform(year: number, month: number, date: number): string {
    const eventDate = format(new Date(year, month, date), 'MM/dd/yyyy');
    // access to the selector w/o subscribing
    const dailyMoodList = this.store.selectSnapshot(MoodState.dailyMoodList);
    const result = dailyMoodList?.find((mood) => mood.eventDate === eventDate);
    if (result) {
      return result.mood;
    } else {
      return '';
    }
  }
}
