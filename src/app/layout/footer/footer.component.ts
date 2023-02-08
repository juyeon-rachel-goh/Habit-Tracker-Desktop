import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NewsLetterService } from 'src/app/shared/services/news-letter.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor(private newLetterService: NewsLetterService) {}

  public newsletterForm = new FormGroup({ email: new FormControl('') });

  ngOnInit(): void {}
  onNewsLetterSubmit() {
    console.log(this.newsletterForm.value);
    this.newLetterService.addSubscriber(this.newsletterForm.value).subscribe();
  }
}
