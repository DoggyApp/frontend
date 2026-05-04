import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DogCalendarComponent } from './dog-calendar.component';

describe('DogCalendarComponent', () => {
  let component: DogCalendarComponent;
  let fixture: ComponentFixture<DogCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DogCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DogCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
