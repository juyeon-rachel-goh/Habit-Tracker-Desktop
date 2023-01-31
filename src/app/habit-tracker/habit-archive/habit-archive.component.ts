import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { catchError, take, tap } from 'rxjs';
import { Habit } from 'src/app/shared/models/habit';
import { ArchiveHabit } from 'src/app/store/habit.action';
import { HabitState } from 'src/app/store/habit.state';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-habit-archive',
  templateUrl: './habit-archive.component.html',
  styleUrls: ['./habit-archive.component.scss'],
})
export class HabitArchiveComponent implements OnInit {
  public archivedHabits: Habit[] = [];
  constructor(
    private store: Store,
    private router: Router,
    public dialogRef: MatDialogRef<HabitArchiveComponent>
  ) {}

  ngOnInit(): void {
    this.archivedHabits = this.store
      .selectSnapshot(HabitState.habitsList)
      .filter((data) => data.archiveStatus);
  }

  public onClick(id: string) {
    console.log(id);
    this.store
      .dispatch(new ArchiveHabit(false, id))
      .pipe(
        take(1),
        tap(() => this.dialogRef.close()),
        catchError((err) => {
          throw alert(err.message);
        })
      )
      .subscribe(() => window.location.reload());
  }
}
