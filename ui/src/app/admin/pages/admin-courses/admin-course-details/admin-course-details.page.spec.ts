import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCourseDetailsPage } from './admin-course-details.page';

describe('AdminCourseDetailsPage', () => {
  let component: AdminCourseDetailsPage;
  let fixture: ComponentFixture<AdminCourseDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCourseDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
