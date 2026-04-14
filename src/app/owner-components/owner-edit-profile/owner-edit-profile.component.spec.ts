import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerEditProfileComponent } from './owner-edit-profile.component';

describe('OwnerEditProfileComponent', () => {
  let component: OwnerEditProfileComponent;
  let fixture: ComponentFixture<OwnerEditProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerEditProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerEditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
