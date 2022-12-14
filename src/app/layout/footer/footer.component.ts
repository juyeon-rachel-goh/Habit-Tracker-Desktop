import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor() {}

  public newsletterForm = new FormGroup({ newSubscriber: new FormControl('') });

  ngOnInit(): void {}
  onNewsLetterSubmit() {
    console.log(this.newsletterForm.value);
  }
}
