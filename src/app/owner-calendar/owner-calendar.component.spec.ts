import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCalendarComponent } from './owner-calendar.component';

describe('OwnerCalendarComponent', () => {
  let component: OwnerCalendarComponent;
  let fixture: ComponentFixture<OwnerCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
