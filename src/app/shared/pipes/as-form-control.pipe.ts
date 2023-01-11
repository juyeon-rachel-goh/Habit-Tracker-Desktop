import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Pipe({
  name: 'asFormControl',
})
export class AsFormControlPipe implements PipeTransform {
  transform(control: AbstractControl | null): FormControl {
    if (control) {
      return control as FormControl;
    } else {
      return new FormControl();
    }
  }
}
