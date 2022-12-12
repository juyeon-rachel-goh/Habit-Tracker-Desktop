import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-textfield',
  templateUrl: './textfield.component.html',
  styleUrls: ['./textfield.component.scss'],
})
export class TextfieldComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() hint: string = '';
  @Input() formControl?: FormControl;
}
