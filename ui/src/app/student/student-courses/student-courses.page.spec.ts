import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentCoursesPage } from './student-courses.page';

describe('StudentCoursesPage', () => {
  let component: StudentCoursesPage;
  let fixture: ComponentFixture<StudentCoursesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCoursesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
