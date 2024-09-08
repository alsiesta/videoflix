import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserconfirmnewpasswordComponent } from './user-confirm-new-password.component';

describe('UserconfirmnewpasswordComponent', () => {
  let component: UserconfirmnewpasswordComponent;
  let fixture: ComponentFixture<UserconfirmnewpasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserconfirmnewpasswordComponent]
    });
    fixture = TestBed.createComponent(UserconfirmnewpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
