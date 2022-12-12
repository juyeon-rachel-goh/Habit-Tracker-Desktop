import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'http://localhost:4200/api/auth';
  constructor(private http: HttpClient) {}

  public addUser(user: User): Observable<User> {
    const url = `${this.url}/register`;
    return this.http.post<User>(url, user);
  }
}