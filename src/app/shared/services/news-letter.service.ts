import { Injectable } from '@angular/core';
import { Subscriber } from '../models/subscriber';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsLetterService {
  private url = 'api/subscription';
  constructor(private http: HttpClient) {}

  addSubscriber(subscriber: Subscriber): Observable<Subscriber> {
    const url = `${this.url}`;
    return this.http.post<Subscriber>(url, subscriber);
  }
}
