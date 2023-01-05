import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AuthState, UserInfo } from 'src/app/store/auth.state';

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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userInfo$.subscribe((data) => {
      this.username = data.username ?? '';
    });
  }

  onSignOut() {
    this.authService.signOutUser(this.username).subscribe();
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
