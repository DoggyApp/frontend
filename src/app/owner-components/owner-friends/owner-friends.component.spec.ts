import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerFriendsComponent } from './owner-friends.component';

describe('OwnerFriendsComponent', () => {
  let component: OwnerFriendsComponent;
  let fixture: ComponentFixture<OwnerFriendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerFriendsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
