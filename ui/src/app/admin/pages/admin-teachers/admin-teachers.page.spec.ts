import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminTeachersPage } from './admin-teachers.page';

describe('AdminTeachersPage', () => {
  let component: AdminTeachersPage;
  let fixture: ComponentFixture<AdminTeachersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTeachersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
