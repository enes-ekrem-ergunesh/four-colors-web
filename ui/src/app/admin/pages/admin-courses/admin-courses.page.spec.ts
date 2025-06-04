import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCoursesPage } from './admin-courses.page';

describe('AdminCoursesPage', () => {
  let component: AdminCoursesPage;
  let fixture: ComponentFixture<AdminCoursesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCoursesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
