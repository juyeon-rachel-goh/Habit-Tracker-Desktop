import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactUsService } from '../shared/services/contact-us.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  public contactUsForm = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private contactUsService: ContactUsService
  ) {}

  ngOnInit(): void {
    this.contactUsForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      content: ['', [Validators.required]],
    });
  }

  onSubmit() {
    console.log(this.contactUsForm.value);
    this.contactUsService.sendEmail(this.contactUsForm.value).subscribe();
  }
}
