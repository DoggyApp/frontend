import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { OrgRegisterComponent } from './org-register.component';

describe('OrgRegisterComponent', () => {
  let component: OrgRegisterComponent;
  let fixture: ComponentFixture<OrgRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrgRegisterComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
