import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HabitDetailComponent } from './habit-detail.component';
import { StoreModule } from 'src/app/store/store/store.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Store } from '@ngxs/store';

fdescribe('HabitDetailComponent', () => {
  let component: HabitDetailComponent;
  let fixture: ComponentFixture<HabitDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HabitDetailComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        StoreModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should return ....', () => {
  //   component.habitData = {} as any;
  //   const store = TestBed.inject(Store);
  //   store.reset({
  //     ...store.snapshot,
  //     record: { dailyRecords: [] },
  //   });
  //   component.calculateStreaks();
  //   expect(component.streaks).toEqual([{
  //     streak: 1;
  //     startDate: Date;
  //     endDate?: Date;
  //   }]);
  //   expect(result.results).toBeTruthy();
  //   // expect(result.results.length).toEqual(1);
  // });
});
