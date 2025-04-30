import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewStudentPage } from './new-student.page';

describe('NewStudentPage', () => {
  let component: NewStudentPage;
  let fixture: ComponentFixture<NewStudentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewStudentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
