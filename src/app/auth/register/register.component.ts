import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(private authService: AuthService) {}
  public registerForm = new FormGroup({});
  ngOnInit(): void {}

  onSubmit() {
    console.log('this works');
    this.authService.addUser(this.registerForm.value).subscribe();
  }
}
