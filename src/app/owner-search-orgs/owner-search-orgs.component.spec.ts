import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerSearchOrgsComponent } from './owner-search-orgs.component';

describe('OwnerSearchOrgsComponent', () => {
  let component: OwnerSearchOrgsComponent;
  let fixture: ComponentFixture<OwnerSearchOrgsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerSearchOrgsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerSearchOrgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
