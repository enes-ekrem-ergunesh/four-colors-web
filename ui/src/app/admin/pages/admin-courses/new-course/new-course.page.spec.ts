import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewCoursePage } from './new-course.page';

describe('NewCoursePage', () => {
  let component: NewCoursePage;
  let fixture: ComponentFixture<NewCoursePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCoursePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
