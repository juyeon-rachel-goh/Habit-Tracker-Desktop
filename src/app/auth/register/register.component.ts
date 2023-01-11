import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  public registerForm = new FormGroup({});
  public showPassword: boolean = false;
  public passwordType = 'text';
  public passwordIcon = 'visibility_off';

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.email]],
      //password format validation comes from the backend
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    console.log(this.registerForm.value);
    this.authService
      .checkDuplicateEmail(this.registerForm.value.email)
      .subscribe((res) => {
        if (res === null) {
          this.authService.addUser(this.registerForm.value).subscribe(() => {
            alert('Submission Successful!');
          });
          this.registerForm.reset();
        } else {
          this.registerForm.get('email')?.setErrors(res);
        }
      });
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.passwordType = this.showPassword ? 'text' : 'password';
    this.passwordIcon = this.showPassword ? 'visibility_off' : 'visibility';
  }
}
