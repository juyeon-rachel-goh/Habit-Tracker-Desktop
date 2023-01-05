import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SetUserInfo, ClearUserInfo } from './auth.action';
import { getCookie } from 'typescript-cookie';

interface AuthStateInterface {
  userInfo?: UserInfo;
}

export interface UserInfo {
  username?: string;
}

// State = Class definition
@State<AuthStateInterface>({
  name: 'auth',
  defaults: {},
})
@Injectable()
export class AuthState {
  @Action(SetUserInfo)
  setUserInfo(ctx: StateContext<AuthStateInterface>) {
    const cookieStr = getCookie('userInfo');
    if (cookieStr !== undefined) {
      const userInfo: UserInfo = JSON.parse(cookieStr);
      ctx.setState({
        userInfo: userInfo,
      });
    }
  }

  @Action(ClearUserInfo)
  clearUserInfo(ctx: StateContext<AuthStateInterface>) {
    return ctx.setState({
      userInfo: undefined,
    });
  }

  @Selector()
  static userInfo(state: AuthStateInterface) {
    return state.userInfo;
  }

  @Selector()
  static isLoggedIn(state: AuthStateInterface) {
    return !!state.userInfo?.username; // string -> boolean
  }
}
