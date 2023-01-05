import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { AuthService } from 'src/app/services/auth.service';
import { AuthState, UserInfo } from 'src/app/store/auth.state';
import { ClearUserInfo, SetUserInfo } from 'src/app/store/auth.action';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public username: string = '';
  @Select(AuthState.userInfo) userInfo$!: Observable<UserInfo>;
  @Select(AuthState.isLoggedIn) isLoggedin$!: Observable<UserInfo>;
  isNavbarCollapsed = true;

  constructor(private authService: AuthService, private store: Store) {}

  ngOnInit(): void {
    this.userInfo$.subscribe((data) => {
      this.username = data?.username ?? '';
    });
  }

  onSignOut() {
    this.authService
      .signOutUser()
      .subscribe(() => this.store.dispatch(new ClearUserInfo()));
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
