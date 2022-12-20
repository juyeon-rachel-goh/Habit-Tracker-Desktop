import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { SetUserInfo } from './auth.action';
import { getCookie, getCookies, setCookie } from 'typescript-cookie';

interface AuthStateInterface {
  userInfo?: UserInfo;
}

interface UserInfo {
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
    const state = ctx.getState();
    const cookieStr = getCookie('userInfo'); //returns a string
    const username = cookieStr?.split('"')[3];
    ctx.setState({
      ...state,
      userInfo: { username },
    });
    console.log(ctx.getState());
  }
}
