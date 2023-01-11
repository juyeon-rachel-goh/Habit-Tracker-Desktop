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
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{9,}'
          ),
        ],
      ],
    });
  }

  onSubmit() {
    console.log(this.registerForm.value);
    // check id
    this.authService
      .checkDuplicateUserName(this.registerForm.value.email)
      .subscribe();
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
          console.log(this.registerForm.get('email'));
        }
      });
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.passwordType = this.showPassword ? 'text' : 'password';
    this.passwordIcon = this.showPassword ? 'visibility_off' : 'visibility';
  }
}
