import { Pipe, PipeTransform } from '@angular/core';
import { getDay } from 'date-fns';

@Pipe({
  name: 'getDay',
})
export class GetDayPipe implements PipeTransform {
  transform(date: number, month: number, year: number): string {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const dayIndex = getDay(new Date(year, month, date));
    console.log(month);
    const result = days[dayIndex];

    return result;
  }
}
