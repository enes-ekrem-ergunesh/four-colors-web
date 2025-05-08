import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormGroup, FormsModule} from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {Nav} from "../../../../interfaces/ui/nav";
import {CommonTsService} from "../../../../services/common-ts/common-ts.service";
import {ConfigService} from "../../../../services/config/config.service";
import {Router} from "@angular/router";
import {catchError} from "rxjs";
import {ClassroomService} from "../../../../services/api/classroom/classroom.service";
import {NewClassroom} from "../../../../interfaces/api/new-classroom";
import {NavbarComponent} from "../../../../components/complex/navbar/navbar.component";
import {NewCourseFormComponent} from "../../../../components/form/new-course-form/new-course-form.component";
import {NewClassroomFormComponent} from "../../../../components/form/new-classroom-form/new-classroom-form.component";

@Component({
  selector: 'app-new-classroom',
  templateUrl: './new-classroom.page.html',
  styleUrls: ['./new-classroom.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, NavbarComponent, NewCourseFormComponent, NewClassroomFormComponent]
})
export class NewClassroomPage {
  navs!: Nav[]

  constructor(
    common_ts: CommonTsService,
    private classroomService: ClassroomService,
    private configService: ConfigService,
    private router: Router,
  ) {
    this.navs = common_ts.admin_navs
  }

  async add_classroom(classroomForm: FormGroup) {
    let newClassroom: NewClassroom = {
      course_id: classroomForm.get('course_id')?.value,
      name: classroomForm.get('name')?.value,
      number_of_sessions: classroomForm.get('number_of_sessions')?.value,
      expected_session_duration: classroomForm.get('expected_session_duration')?.value,
    };
    (await this.classroomService.new_classroom(newClassroom))
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe(res => {
        console.log(res)
        this.configService.successHandler("Classroom created successfully")
        this.router.navigate(['/admin-classrooms'])
      })
  }

}
