import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'api/auth';
  constructor(private http: HttpClient) {}

  // // Services for REGISTER // //
  public addUser(user: User): Observable<User> {
    const url = `${this.url}/register`;
    return this.http.post<User>(url, user);
  }

  public checkDuplicateUsername(
    username: string
  ): Observable<ValidationErrors | null> {
    const url = `${this.url}/validate-username/${username}`;
    return this.http.post<any>(url, username);
  }
  // Check if the entered email is already taken or not at the registeration
  public checkDuplicateEmail(
    email: string
  ): Observable<ValidationErrors | null> {
    const url = `${this.url}/validate-email/${email}`;
    return this.http.post<any>(url, email);
  }

  // // Services for SIGNIN and OUT // //
  public signInUser(user: User): Observable<User> {
    const url = `${this.url}/signin`;
    return this.http.post<User>(url, user);
  }

  public signOutUser(): Observable<any> {
    const url = `${this.url}/signout`;
    return this.http.post(url, null);
  }
}
