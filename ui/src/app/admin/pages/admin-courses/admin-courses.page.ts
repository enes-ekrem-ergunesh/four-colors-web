import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Nav} from "../../../interfaces/ui/nav";
import {Course} from "../../../interfaces/api/course";
import {NavbarComponent} from "../../../components/complex/navbar/navbar.component";
import {CommonTsService} from "../../../services/common-ts/common-ts.service";
import {ConfigService} from "../../../services/config/config.service";
import {catchError} from "rxjs";
import {CourseService} from "../../../services/api/course/course.service";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {CourseTableComponent} from "../../../components/complex/course-table/course-table.component";

@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.page.html',
  styleUrls: ['./admin-courses.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink, RouterLinkActive, CourseTableComponent]
})
export class AdminCoursesPage implements OnInit {
  navs!: Nav[]
  courses: Course[] = [];

  constructor(
    common_ts: CommonTsService,
    private courseService: CourseService,
    private configService: ConfigService,
  ) {
    this.navs = common_ts.admin_navs
  }

  async ngOnInit() {
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

}
