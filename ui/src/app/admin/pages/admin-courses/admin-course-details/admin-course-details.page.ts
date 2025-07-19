import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Course} from "../../../../interfaces/api/course";
import {CourseService} from "../../../../services/api/course/course.service";
import {catchError} from "rxjs";
import {ConfigService} from "../../../../services/config/config.service";
import {Nav} from "../../../../interfaces/ui/nav";
import {CommonTsService} from "../../../../services/common-ts/common-ts.service";
import {NavbarComponent} from "../../../../components/complex/navbar/navbar.component";
import {ClassroomTableComponent} from "../../../../components/complex/classroom-table/classroom-table.component";
import {Classroom} from "../../../../interfaces/api/classroom";
import {ClassroomService} from "../../../../services/api/classroom/classroom.service";
import {User} from "../../../../interfaces/api/user";
import {TeacherService} from "../../../../services/api/teacher/teacher.service";
import {UserTableComponent} from "../../../../components/complex/user-table/user-table.component";

@Component({
  selector: 'app-admin-course-details',
  templateUrl: './admin-course-details.page.html',
  styleUrls: ['./admin-course-details.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink, ClassroomTableComponent, UserTableComponent]
})
export class AdminCourseDetailsPage implements OnInit {
  navs!: Nav[]
  courseId!: number;
  course: Course = {} as Course;
  courseClassrooms: Classroom[] = [];
  courseTeachers: User[] = []

  constructor(
    common_ts: CommonTsService,
    private readonly route: ActivatedRoute,
    private courseService: CourseService,
    private classroomService: ClassroomService,
    private teacherService: TeacherService,
    private configService: ConfigService,
  ) {
    this.navs = common_ts.admin_navs
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'))
  }

  async ngOnInit() {
    await this.refresh_the_view()
  }

  async getCourseDetails() {
    (await this.courseService.get_course_by_id(this.courseId))
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe(res => {
        this.course = res as Course;
        console.log(this.course);
      })
  }

  async getCourseClassrooms(){
    (await this.classroomService.get_classrooms_by_course_id(this.courseId))
      .subscribe(res => {
        this.courseClassrooms = res as Classroom[];
      })
  }

  async getCourseTeachers(){
    (await this.teacherService.get_teachers_by_course_id(this.courseId))
      .subscribe(res => {
        this.courseTeachers = res as User[];
      })
  }

  async soft_delete_classroom(classroom_id: number) {
    (await this.classroomService.soft_delete_classroom(classroom_id))
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe(async () => {
        this.configService.successHandler("Classroom soft deleted successfully");
        await this.refresh_the_view();
      })
  }

  async refresh_the_view(){
    await this.getCourseDetails()
    await this.getCourseClassrooms()
    await this.getCourseTeachers()
  }


}
