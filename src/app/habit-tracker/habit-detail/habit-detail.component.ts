import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, map, switchMap, takeUntil } from 'rxjs';
import { Habit } from 'src/app/shared/models/habit';
import { HabitState } from 'src/app/store/habit.state';

@Component({
  selector: 'app-habit-detail',
  templateUrl: './habit-detail.component.html',
  styleUrls: ['./habit-detail.component.scss'],
})
export class HabitDetailComponent implements OnInit, OnDestroy {
  @Select(HabitState.habitsList) habitsList?: Observable<Habit[]>;
  public habitData?: Observable<Habit>;
  public habitId: string = '';
  public ngDestroyed = new Subject<void>();

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params) {
        this.habitId = params.get('id') || '';
      }

      this.habitData = this.store.select(HabitState.getHabitbyId).pipe(
        switchMap((filterFn) => filterFn(this.habitId)),
        takeUntil(this.ngDestroyed)
      );
    });

    this.habitData?.subscribe((data) => console.log(data));

    // call transform data function for habitForm
    // this.setHabitFormbyID(this.habitId)

    //getHabitbyId -> display values
    //store values into a form
  }

  onArchive(): void {
    // button to patch value inside of the form and dispatch update action
  }

  onEdit(): void {
    // redirect to edit/add page and do something there
  }

  onDelete() {
    // ask are you sure you want to delete this? All history and data will be deleted from server
    // if yes, call service to delete and pass
    // if no, back out (route.navigate(['../']))
  }

  ngOnDestroy() {
    this.ngDestroyed.next();
  }
}
