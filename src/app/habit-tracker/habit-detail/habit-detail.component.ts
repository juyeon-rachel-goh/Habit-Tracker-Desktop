import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, catchError, take, tap } from 'rxjs';
import { Habit } from 'src/app/shared/models/habit';
import { HabitService } from 'src/app/shared/services/habit.service';
import { DeleteHabit } from 'src/app/store/habit.action';
import { HabitState } from 'src/app/store/habit.state';

@Component({
  selector: 'app-habit-detail',
  templateUrl: './habit-detail.component.html',
  styleUrls: ['./habit-detail.component.scss'],
})
export class HabitDetailComponent implements OnInit {
  public habitData?: Habit;
  public habitId: string = '';
  public currentArchiveStatus: string = '';
  public isArchived!: boolean;
  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
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
  }

  onClickArchive(): void {
    // button to patch value inside of the form and dispatch update action
    const currentStatus = this.store.selectSnapshot(HabitState.getHabitbyId)(
      this.habitId
    )?.archiveStatus;
    console.log(currentStatus);
    if (currentStatus == false) {
      this.isArchived = true;
    } else {
      this.isArchived = false;
    }
    this.habitService.archiveHabit(this.isArchived, this.habitId).subscribe();
  }

  onEdit(id: string) {
    this.router.navigate([`/habit-tracker/habit-edit/${id}`]);
  }

  onDelete() {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      const habitsList = this.store.selectSnapshot(HabitState.habitsList);
      const result = habitsList!.find((mood) => mood.id === this.habitId);
      this.store
        .dispatch(new DeleteHabit(result?.id!))
        .pipe(
          take(1),
          tap(() => this.router.navigate(['/habit-tracker'])),
          catchError((err) => {
            throw alert(err.message);
          })
        )
        .subscribe();
      return true;
    } else {
      return false;
    }
  }
}
