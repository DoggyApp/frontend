import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PublicOrgProfileComponent } from './public-org-profile.component';

describe('PublicOrgProfileComponent', () => {
  let component: PublicOrgProfileComponent;
  let fixture: ComponentFixture<PublicOrgProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicOrgProfileComponent],
      imports: [RouterTestingModule, HttpClientTestingModule]
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
