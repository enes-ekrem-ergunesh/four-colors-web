import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewClassroomPage } from './new-classroom.page';

describe('NewClassroomPage', () => {
  let component: NewClassroomPage;
  let fixture: ComponentFixture<NewClassroomPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewClassroomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
