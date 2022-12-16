import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitMoodSelectorComponent } from './habit-mood-selector.component';

describe('HabitMoodSelectorComponent', () => {
  let component: HabitMoodSelectorComponent;
  let fixture: ComponentFixture<HabitMoodSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HabitMoodSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitMoodSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
