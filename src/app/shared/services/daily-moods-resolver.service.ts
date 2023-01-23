import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { GetDailyMoods } from 'src/app/store/mood.action';

@Injectable({
  providedIn: 'root',
})
export class DailyMoodsResolverService implements Resolve<void> {
  constructor(private store: Store) {}
  resolve(): Observable<void> {
    return this.store.dispatch(new GetDailyMoods());
  }
}
