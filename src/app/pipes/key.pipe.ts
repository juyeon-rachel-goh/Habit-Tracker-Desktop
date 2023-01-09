// generalized pipe to take keys out of js object
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keys',
})
export class KeysPipe implements PipeTransform {
  transform(value: any): string[] {
    if (undefined || null) {
      return [];
    }
    return Object.keys(value);
  }
}
