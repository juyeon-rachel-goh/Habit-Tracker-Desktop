import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { GetDailyRecords } from 'src/app/store/daily-record.action';

@Injectable({
  providedIn: 'root',
})
export class CompletionStatusResolver implements Resolve<void> {
  constructor(private store: Store) {}
  resolve(): Observable<void> {
    return this.store.dispatch(new GetDailyRecords());
  }
}
