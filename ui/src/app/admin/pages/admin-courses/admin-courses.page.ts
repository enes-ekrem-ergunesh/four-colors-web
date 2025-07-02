import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Nav} from "../../../interfaces/ui/nav";
import {Course} from "../../../interfaces/api/course";
import {NavbarComponent} from "../../../components/complex/navbar/navbar.component";
import {CommonTsService} from "../../../services/common-ts/common-ts.service";
import {ConfigService} from "../../../services/config/config.service";
import {catchError} from "rxjs";
import {CourseService} from "../../../services/api/course/course.service";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {CourseTableComponent} from "../../../components/complex/course-table/course-table.component";
import {Classroom} from "../../../interfaces/api/classroom";

@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.page.html',
  styleUrls: ['./admin-courses.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink, RouterLinkActive, CourseTableComponent, ReactiveFormsModule]
})
export class AdminCoursesPage implements OnInit {
  navs!: Nav[]
  courses: Course[] = [];
  show_deleted_courses = new FormControl<boolean>(true);

  constructor(
    common_ts: CommonTsService,
    private courseService: CourseService,
    private configService: ConfigService,
  ) {
    this.navs = common_ts.admin_navs
  }

  async ngOnInit() {
    await this.get_courses()
  }

  async soft_delete_course(course_id: number) {
    (await this.courseService.soft_delete_course(course_id))
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe(async () => {
        this.configService.successHandler("Course soft deleted successfully");
        await this.refresh_the_view();
      })
  }

  async get_courses() {
    (await this.courseService.get_courses())
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe((response) => {
        this.courses = response as Course[];
      })
  }

  async refresh_the_view() {
    await this.get_courses()
  }

  filter_courses() {
    if (this.show_deleted_courses.value) {
      return this.courses
    }
    return this.courses.filter(course => course.deleted_at === null)
  }

}
