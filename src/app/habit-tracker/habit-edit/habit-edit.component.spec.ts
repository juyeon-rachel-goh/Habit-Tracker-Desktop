import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitEditComponent } from './habit-edit.component';

describe('HabitEditComponent', () => {
  let component: HabitEditComponent;
  let fixture: ComponentFixture<HabitEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HabitEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
