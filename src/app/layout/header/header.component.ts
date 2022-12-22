import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState, UserInfo } from 'src/app/store/auth.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Select(AuthState.userInfo) userInfo$!: Observable<UserInfo>;
  @Select(AuthState.isLoggedIn) isLoggedin$!: Observable<UserInfo>;
  isNavbarCollapsed = true;

  constructor() {}

  ngOnInit(): void {
    this.userInfo$.subscribe((data) => {
      console.log(data);
    });
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
