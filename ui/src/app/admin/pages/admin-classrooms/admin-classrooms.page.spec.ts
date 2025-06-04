import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminClassroomsPage } from './admin-classrooms.page';

describe('AdminClassroomsPage', () => {
  let component: AdminClassroomsPage;
  let fixture: ComponentFixture<AdminClassroomsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminClassroomsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
