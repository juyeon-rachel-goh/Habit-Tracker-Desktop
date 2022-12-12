import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  public contactUsForm = new FormGroup({});

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.contactUsForm = this.formBuilder.group({
      firstName: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z\\-]+')],
      ],
      lastName: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z\\-]+')],
      ],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {}
}
