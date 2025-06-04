import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUserDetailsPage } from './admin-user-details.page';

describe('AdminUserDetailsPage', () => {
  let component: AdminUserDetailsPage;
  let fixture: ComponentFixture<AdminUserDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
