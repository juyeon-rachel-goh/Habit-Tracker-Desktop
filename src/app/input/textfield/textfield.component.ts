import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';

@Component({
  selector: 'app-textfield',
  templateUrl: './textfield.component.html',
  styleUrls: ['./textfield.component.scss'],
})
export class TextfieldComponent implements OnInit {
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  options = this._formBuilder.group({
    floatLabel: this.floatLabelControl,
  });

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {}

  @Input() label: string = '';
  @Input() inputType: string = '';
  @Input() buttonType: string = '';
  @Input() icon: string = '';
  @Input() tooltipMsg: string = '';
  @Input() event: string = '';
  @Input() errorMessage: string = '';
  @Input() condition?: boolean;
  @Input() errorMessage2: string = '';
  @Input() condition2?: boolean;
  @Input() inputFormControl?: FormControl;

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }
}
