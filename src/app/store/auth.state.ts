import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { SetUserInfo } from './auth.state.action';

interface AuthStateInterface {
  userInfo?: UserInfo;
}

interface UserInfo {
  userName: string;
}

@State<AuthStateInterface>({
  name: 'auth',
  defaults: {},
})
@Injectable()
export class AuthState {
  @Action(SetUserInfo)
  setUserInfo(ctx: StateContext<AuthStateInterface>) {
    console.warn('...');
  }
}
