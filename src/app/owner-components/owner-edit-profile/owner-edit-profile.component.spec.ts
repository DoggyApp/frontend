import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { OwnerEditProfileComponent } from './owner-edit-profile.component';
import { PasswordStrengthDirective } from '../../validators/password-strength.directive';

describe('OwnerEditProfileComponent', () => {
  let component: OwnerEditProfileComponent;
  let fixture: ComponentFixture<OwnerEditProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OwnerEditProfileComponent, PasswordStrengthDirective],
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule]
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
