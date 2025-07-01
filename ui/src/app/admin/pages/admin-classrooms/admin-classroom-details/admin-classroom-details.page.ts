import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Nav} from "../../../../interfaces/ui/nav";
import {Classroom} from "../../../../interfaces/api/classroom";
import {User} from "../../../../interfaces/api/user";
import {CommonTsService} from "../../../../services/common-ts/common-ts.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {CourseService} from "../../../../services/api/course/course.service";
import {ClassroomService} from "../../../../services/api/classroom/classroom.service";
import {TeacherService} from "../../../../services/api/teacher/teacher.service";
import {ConfigService} from "../../../../services/config/config.service";
import {catchError} from "rxjs";
import {NavbarComponent} from "../../../../components/complex/navbar/navbar.component";
import {UserTableComponent} from "../../../../components/complex/user-table/user-table.component";

@Component({
  selector: 'app-admin-classroom-details',
  templateUrl: './admin-classroom-details.page.html',
  styleUrls: ['./admin-classroom-details.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink, UserTableComponent]
})
export class AdminClassroomDetailsPage implements OnInit {
  navs!: Nav[]
  classroomId!: number;
  classroom: Classroom = {} as Classroom;
  classroomTeachers: User[] = []
  classroomStudents: User[] = [];

  constructor(
    common_ts: CommonTsService,
    private readonly route: ActivatedRoute,
    private courseService: CourseService,
    private classroomService: ClassroomService,
    private teacherService: TeacherService,
    private configService: ConfigService,
  ) {
    this.navs = common_ts.admin_navs
    this.classroomId = Number(this.route.snapshot.paramMap.get('classroomId'))
  }

  async ngOnInit() {
    await this.getClassroomDetails()
    await this.getClassroomTeachers()
  }

  async getClassroomDetails() {
    (await this.classroomService.get_classroom_by_id(this.classroomId))
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe(res => {
        this.classroom = res as Classroom;
        console.log(this.classroom);
      })
  }

  async getClassroomTeachers(){
    (await this.teacherService.get_teachers_by_classroom_id(this.classroomId))
      .subscribe(res => {
        this.classroomTeachers = res as User[];
      })
  }

}
