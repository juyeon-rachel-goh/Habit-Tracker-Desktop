import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SetUserInfo } from 'src/app/store/auth.action';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private store: Store,
    private router: Router
  ) {}

  public registerForm = new FormGroup({});
  public showPassword: boolean = false;
  public registerComplete: boolean = false;
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
    this.authService
      .checkDuplicateUsername(this.registerForm.value.username)
      .subscribe((res) => {
        if (res === null) {
          this.authService
            .checkDuplicateEmail(this.registerForm.value.email)
            .subscribe((res) => {
              if (res === null) {
                this.authService
                  .addUser(this.registerForm.value)
                  .subscribe(() => {
                    this.registerComplete = true;
                    this.store.dispatch(new SetUserInfo());
                    setTimeout(() => {
                      this.router.navigate(['/habit-tracker']);
                    }, 5000);
                  });
              } else {
                this.registerForm.get('email')?.setErrors(res);
              }
            });
        } else {
          this.registerForm.get('username')?.setErrors(res);
        }
      });
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.passwordType = this.showPassword ? 'text' : 'password';
    this.passwordIcon = this.showPassword ? 'visibility_off' : 'visibility';
  }
}
