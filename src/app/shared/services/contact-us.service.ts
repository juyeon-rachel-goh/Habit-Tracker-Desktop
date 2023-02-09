import { HttpClient } from '@angular/common/http';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactUsService {
  private url = 'http://localhost:4200/api/send-email';
  constructor(private http: HttpClient) {}

  sendEmail(message: Message): Observable<Message> {
    const url = `${this.url}`;
    return this.http.post<Message>(url, message);
  }
}
