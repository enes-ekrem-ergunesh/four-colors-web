import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyCoursesPage } from './my-courses.page';

describe('MyCoursesPage', () => {
  let component: MyCoursesPage;
  let fixture: ComponentFixture<MyCoursesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCoursesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
