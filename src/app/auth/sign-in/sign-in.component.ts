import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { AuthService } from 'src/app/services/auth.service';
import { SetUserInfo } from 'src/app/store/auth.action';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private store: Store
  ) {}
  public signInForm = new FormGroup({});
  public showPassword: boolean = false;
  public passwordType = 'text';
  public passwordIcon = 'visibility_off';

  ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    // dispatch actions (=run function) by injecting the Store and calling a class
    this.authService.signInUser(this.signInForm.value).subscribe((data) => {
      const username = this.signInForm.get('username')?.value;
      this.store.dispatch(new SetUserInfo());
    });
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.passwordType = this.showPassword ? 'text' : 'password';
    this.passwordIcon = this.showPassword ? 'visibility_off' : 'visibility';
  }
}
