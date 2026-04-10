import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerNavComponent } from './owner-nav.component';

describe('OwnerNavComponent', () => {
  let component: OwnerNavComponent;
  let fixture: ComponentFixture<OwnerNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
