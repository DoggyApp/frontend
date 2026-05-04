import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OwnerNavComponent } from './owner-nav.component';

describe('OwnerNavComponent', () => {
  let component: OwnerNavComponent;
  let fixture: ComponentFixture<OwnerNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OwnerNavComponent],
      imports: [RouterTestingModule, HttpClientTestingModule]
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
