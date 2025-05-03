import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewTeacherPage } from './new-teacher.page';

describe('NewTeacherPage', () => {
  let component: NewTeacherPage;
  let fixture: ComponentFixture<NewTeacherPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTeacherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
