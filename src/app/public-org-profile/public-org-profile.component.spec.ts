import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicOrgProfileComponent } from './public-org-profile.component';

describe('PublicOrgProfileComponent', () => {
  let component: PublicOrgProfileComponent;
  let fixture: ComponentFixture<PublicOrgProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicOrgProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicOrgProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
