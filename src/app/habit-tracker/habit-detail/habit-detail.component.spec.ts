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
import { Frequency } from '../enums/frequency';
import { IconColor } from '../enums/icon-color';
import { endOfDay, sub } from 'date-fns';

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
      frequency: Frequency.Day,
      countPerFreq: 1,
      iconColor: IconColor['#072ac8'],
      createdOn: new Date('2023/02/01'),
      archiveStatus: false,
    };
    const store = TestBed.inject(Store);
    store.reset({
      ...store.snapshot,
      record: {
        dailyRecords: [
          { date: '2023/02/01', habitId: 'testId001' },
          { date: '2023/02/02', habitId: 'testId001' },
          { date: '2023/02/03', habitId: 'testId001' },
          { date: '2023/02/04', habitId: 'testId001' },
          { date: '2023/02/05', habitId: 'testId001' },
          { date: '2023/02/07', habitId: 'testId001' },
          { date: '2023/02/09', habitId: 'testId001' },
          { date: '2023/02/10', habitId: 'testId001' },
        ],
      },
    });
    component.calculateStreaks();
    expect(component.streaks).toEqual([
      {
        streak: 5,
        startDate: new Date('2023/02/01'),
        endDate: sub(new Date('2023/02/06'), { seconds: 1 }),
      },
      {
        streak: 0,
        startDate: new Date('2023/02/06'),
        endDate: endOfDay(new Date('2023/02/06')),
      },
      {
        streak: 1,
        startDate: new Date('2023/02/07'),
        endDate: sub(new Date('2023/02/08'), { seconds: 1 }),
      },
      {
        streak: 0,
        startDate: new Date('2023/02/08'),
        endDate: endOfDay(new Date('2023/02/08')),
      },
      {
        streak: 2,
        startDate: new Date('2023/02/09'),
        endDate: endOfDay(new Date('2023/02/10')),
      },
    ]);
  });

  it('should return Streaks[] of selected WEEKLY habit', () => {
    component.habitData = {
      id: 'testId001',
      habitName: 'mock Habit',
      frequency: Frequency.Week,
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
          { date: '2023/01/12', habitId: 'testId001' },
          { date: '2023/01/16', habitId: 'testId001' },
          { date: '2023/01/17', habitId: 'testId001' }, // streak = 2 1/9 ~ 1/22
          { date: '2023/01/25', habitId: 'testId001' }, // 1/23 ~ 1/29 streak = 0 // 1/30 ~ 2/5 streak = 0
          { date: '2023/02/06', habitId: 'testId001' },
          { date: '2023/02/07', habitId: 'testId001' }, // streak =1 2/6~2/12
        ],
      },
    });
    component.calculateStreaks();
    expect(component.streaks).toEqual([
      {
        streak: 2,
        startDate: new Date('2023/01/09'),
        endDate: sub(new Date('2023/01/23'), { seconds: 1 }),
      },
      {
        streak: 0,
        startDate: new Date('2023/01/23'),
        endDate: endOfDay(new Date('2023/01/29')),
      },
      {
        streak: 0,
        startDate: new Date('2023/01/30'),
        endDate: endOfDay(new Date('2023/02/05')),
      },
      {
        streak: 1,
        startDate: new Date('2023/02/06'),
        endDate: endOfDay(new Date('2023/02/12')),
      },
    ]);
  });

  it('should return Streaks[] of selected MONTHLY habit', () => {
    component.habitData = {
      id: 'testId001',
      habitName: 'mock Habit',
      frequency: Frequency.Month,
      countPerFreq: 2,
      iconColor: IconColor['#072ac8'],
      createdOn: new Date('2022/09/17'),
      archiveStatus: false,
    };
    const store = TestBed.inject(Store);
    store.reset({
      ...store.snapshot,
      record: {
        dailyRecords: [
          { date: '2022/09/20', habitId: 'testId001' },
          { date: '2022/09/22', habitId: 'testId001' },
          { date: '2022/09/28', habitId: 'testId001' },
          { date: '2022/09/30', habitId: 'testId001' }, // streak 1 9/1 ~ 9/30
          { date: '2022/10/15', habitId: 'testId001' },
          { date: '2022/10/31', habitId: 'testId001' }, // streak 2 10/1 ~ 10/31 // 11/1~11/30 SKIP
          { date: '2022/12/14', habitId: 'testId001' },
          { date: '2022/12/25', habitId: 'testId001' }, // streak 1 12/1 ~ 12/31
          { date: '2023/01/11', habitId: 'testId001' }, // streak 0 1/1 ~ 1/31
          { date: '2023/02/01', habitId: 'testId001' },
          { date: '2023/02/10', habitId: 'testId001' }, // streak 1 2/1 ~ 2/28
        ],
      },
    });
    component.calculateStreaks();
    expect(component.streaks).toEqual([
      {
        streak: 2,
        startDate: new Date('2022/09/01'),
        endDate: sub(new Date('2022/11/01'), { seconds: 1 }),
      },
      {
        streak: 0,
        startDate: new Date('2022/11/01'),
        endDate: endOfDay(new Date('2022/11/30')),
      },
      {
        streak: 1,
        startDate: new Date('2022/12/01'),
        endDate: sub(new Date('2023/01/01'), { seconds: 1 }),
      },
      {
        streak: 0,
        startDate: new Date('2023/01/01'),
        endDate: endOfDay(new Date('2023/01/31')),
      },
      {
        streak: 1,
        startDate: new Date('2023/02/01'),
        endDate: endOfDay(new Date('2023/02/28')),
      },
    ]);
  });

  it('should return average score of DAILY habit', () => {
    component.habitData = {
      id: 'testId111',
      habitName: 'mock Habit',
      frequency: Frequency.Day,
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
        streak: 4,
        startDate: new Date('2023/02/03'),
      },
    ];
    component.calculateAvgScore();
    expect(component.avgScore).toEqual(58);
  });

  it('should return average score of MONTHLY habit', () => {
    component.habitData = {
      id: 'testId111',
      habitName: 'mock Habit',
      frequency: Frequency.Month,
      countPerFreq: 2,
      iconColor: IconColor['#072ac8'],
      createdOn: new Date('2020/01/01'),
      archiveStatus: false,
    };
    component.streaks = [
      {
        streak: 11,
        startDate: new Date('2020/01/01'),
      },
      {
        streak: 10,
        startDate: new Date('2021/02/01'),
      },
      {
        streak: 4,
        startDate: new Date('2022/02/01'),
      },
      {
        streak: 7,
        startDate: new Date('2022/05/01'),
      },
    ];
    component.calculateAvgScore();
    expect(component.avgScore).toEqual(84); //// 38 months total, 32 Months streaks
  });
});
