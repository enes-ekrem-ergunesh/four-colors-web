import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminClassroomDetailsPage } from './admin-classroom-details.page';

describe('AdminClassroomDetailsPage', () => {
  let component: AdminClassroomDetailsPage;
  let fixture: ComponentFixture<AdminClassroomDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminClassroomDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
