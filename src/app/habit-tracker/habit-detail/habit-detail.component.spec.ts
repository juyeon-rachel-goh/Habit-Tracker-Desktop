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
import { Freqeuncy } from '../enums/frequency';
import { IconColor } from '../enums/icon-color';
import { endOfDay } from 'date-fns';

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

  it('should return completion count of daily habits with multiple entries on the same day', () => {
    component.habitId = 'testId001';
    component.dailyRecords = [
      {
        date: '2023/01/08',
        habitId: 'testId002',
      },
      {
        date: '2023/01/08',
        habitId: 'testId002',
      },
      {
        date: '2023/01/08',
        habitId: 'testId002',
      },
      {
        date: '2023/01/09',
        habitId: 'testId002',
      },
      {
        date: '2023/01/16',
        habitId: 'testId001',
      },
    ];
    component.findnumOfCompletion();
    expect(component.numOfCompletion).toEqual(3);
  });

  it('should return Streaks[] of selected DAILY habit', () => {
    component.habitData = {
      id: 'testId001',
      habitName: 'mock Habit',
      frequency: Freqeuncy.Day,
      countPerFreq: 1,
      iconColor: IconColor['#072ac8'],
      createdOn: new Date('2023/01/01'),
      archiveStatus: false,
    };
    const store = TestBed.inject(Store);
    store.reset({
      ...store.snapshot,
      record: {
        dailyRecords: [
          { date: '2023/02/01', habitId: 'testId001' },
          { date: '2023/02/04', habitId: 'testId001' },
          { date: '2023/02/05', habitId: 'testId001' },
          { date: '2023/02/07', habitId: 'testId001' },
        ],
      },
    });
    component.calculateStreaks();
    expect(component.streaks).toEqual([
      {
        streak: 1,
        startDate: new Date('2023/02/01'),
        endDate: new Date('2023/02/02'),
      },
      {
        streak: 2,
        startDate: new Date('2023/02/04'),
        endDate: new Date('2023/02/06'),
      },
      {
        streak: 1,
        startDate: new Date('2023/02/07'),
        endDate: new Date('2023/02/08'),
      },
    ]);
  });

  it('should return Streaks[] of selected WEEKLY habit', () => {
    component.habitData = {
      id: 'testId001',
      habitName: 'mock Habit',
      frequency: Freqeuncy.Week,
      countPerFreq: 2,
      iconColor: IconColor['#072ac8'],
      createdOn: new Date('2023/01/11'),
      archiveStatus: false,
    };
    const store = TestBed.inject(Store);
    store.reset({
      ...store.snapshot,
      record: {
        dailyRecords: [
          { date: '2023/01/11', habitId: 'testId001' },
          { date: '2023/01/12', habitId: 'testId001' }, // 1st strk = 1
          { date: '2023/01/16', habitId: 'testId001' },
          { date: '2023/01/21', habitId: 'testId001' }, // 2nd strk = 2 THEN RESET TO 0 (pushed on 1/23 week) (no entry for 1/23 week)
          { date: '2023/01/25', habitId: 'testId001' }, // no goal met
          { date: '2023/02/06', habitId: 'testId001' },
          { date: '2023/02/07', habitId: 'testId001' }, // 3rd strk =1
        ],
      },
    });
    component.calculateStreaks();
    expect(component.streaks).toEqual([
      {
        streak: 2,
        startDate: new Date('2023/01/09'),
        endDate: endOfDay(new Date('2023/01/29')),
      },
      {
        streak: 1,
        startDate: new Date('2023/02/06'),
        endDate: endOfDay(new Date('2023/02/12')),
      },
    ]);
  });

  it('should return average score of habit', () => {
    component.habitData = {
      id: 'testId111',
      habitName: 'mock Habit',
      frequency: Freqeuncy.Day,
      countPerFreq: 2,
      iconColor: IconColor['#072ac8'],
      createdOn: new Date('2023/01/11'),
      archiveStatus: false,
    };
    component.streaks = [
      {
        streak: 11,
        startDate: new Date('2023/01/12'),
      },
      {
        streak: 3,
        startDate: new Date('2023/01/30'),
      },
      {
        streak: 3,
        startDate: new Date('2023/02/03'),
      },
    ];
    component.calculateAvgScore();
    expect(component.avgScore).toEqual(56);
  });
});
