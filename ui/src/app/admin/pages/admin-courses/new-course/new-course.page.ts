import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormGroup, FormsModule} from '@angular/forms';
import {Nav} from "../../../../interfaces/ui/nav";
import {CommonTsService} from "../../../../services/common-ts/common-ts.service";
import {ConfigService} from "../../../../services/config/config.service";
import {catchError} from "rxjs";
import {NewCourse} from "../../../../interfaces/api/new-course";
import {CourseService} from "../../../../services/api/course/course.service";
import {NavbarComponent} from "../../../../components/complex/navbar/navbar.component";
import {NewCourseFormComponent} from "../../../../components/form/new-course-form/new-course-form.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-course',
  templateUrl: './new-course.page.html',
  styleUrls: ['./new-course.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, NewCourseFormComponent]
})
export class NewCoursePage {
  navs!: Nav[]

  constructor(
    common_ts: CommonTsService,
    private courseService: CourseService,
    private configService: ConfigService,
    private router: Router,
  ) {
    this.navs = common_ts.admin_navs
  }

  async add_course(courseForm: FormGroup) {
    let newCourse: NewCourse = {
      name: courseForm.get('name')?.value,
      description: courseForm.get('description')?.value,
    };
    (await this.courseService.new_course(newCourse))
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe(res => {
        console.log(res)
        this.configService.successHandler("Course created successfully")
        this.router.navigate(['/admin-courses'])
      })
  }

}
