import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { Habit } from 'src/app/shared/models/habit';
import { HabitService } from 'src/app/shared/services/habit.service';
import { HabitState } from 'src/app/store/habit.state';

@Component({
  selector: 'app-habit-detail',
  templateUrl: './habit-detail.component.html',
  styleUrls: ['./habit-detail.component.scss'],
})
export class HabitDetailComponent implements OnInit {
  @Select(HabitState.habitsList) habitsList?: Observable<Habit[]>;
  public habitData?: Habit;
  public habitId: string = '';
  public currentArchiveStatus: string = '';
  public isArchived!: string;
  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private habitService: HabitService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params) {
        this.habitId = params.get('id') || '';
      }

      this.habitData = this.store.selectSnapshot(HabitState.getHabitbyId)(
        this.habitId
      );
    });

    // call transform data function for habitForm
    // this.setHabitFormbyID(this.habitId)

    //getHabitbyId -> display values
    //store values into a form
  }

  onClickArchive(): void {
    // button to patch value inside of the form and dispatch update action
    // this.habitData?.subscribe(
    //   (data) => (this.currentArchiveStatus = data.archiveStatus)
    // );
    // if (this.currentArchiveStatus == '0') {
    //   this.isArchived = '1';
    // } else {
    //   this.isArchived = '0';
    // }
    // this.habitService.archiveHabit(this.isArchived, this.habitId);
  }

  onEdit(): void {
    // redirect to edit/add page and do something there
  }

  onDelete() {
    // ask are you sure you want to delete this? All history and data will be deleted from server
    // if yes, call service to delete and pass
    // if no, back out (route.navigate(['../']))
  }
}
