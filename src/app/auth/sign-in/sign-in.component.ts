import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SetUserInfo } from 'src/app/store/auth.action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private store: Store,
    private router: Router
  ) {}
  public signInForm = new FormGroup({});
  public showPassword: boolean = false;
  public passwordType = 'text';
  public passwordIcon = 'visibility_off';
  public errorMessage: string = '';

  ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.authService.signInUser(this.signInForm.value).subscribe(
      () => {
        this.store.dispatch(new SetUserInfo());
        this.router.navigate(['/habit-tracker']);
      },
      // return error message if something goes wrong!
      (err) => {
        if (err.status === 400) {
          this.errorMessage = 'Please check your ID or password again';
        } else {
          this.errorMessage =
            'Oops! Something went wrong. Please try again later';
        }
      }
    );
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.passwordType = this.showPassword ? 'text' : 'password';
    this.passwordIcon = this.showPassword ? 'visibility_off' : 'visibility';
  }
}
