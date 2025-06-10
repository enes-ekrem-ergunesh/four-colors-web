import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {catchError} from "rxjs";
import {AdminService} from "../../../../services/api/admin/admin.service";
import {ConfigService} from "../../../../services/config/config.service";
import {User} from "../../../../interfaces/api/user";
import {ClassroomTableComponent} from "../../../../components/complex/classroom-table/classroom-table.component";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {CourseTableComponent} from "../../../../components/complex/course-table/course-table.component";
import {Course} from "../../../../interfaces/api/course";
import {Classroom} from "../../../../interfaces/api/classroom";
import {CourseService} from "../../../../services/api/course/course.service";
import {ClassroomService} from "../../../../services/api/classroom/classroom.service";
import {TeacherService} from "../../../../services/api/teacher/teacher.service";
import {Tooltip} from "bootstrap";

@Component({
  selector: 'app-admin-teacher-details',
  templateUrl: './admin-teacher-details.component.html',
  styleUrls: ['./admin-teacher-details.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    ClassroomTableComponent,
    DatePipe,
    CourseTableComponent,
    NgForOf,
    NgIf
  ]
})
export class AdminTeacherDetailsComponent implements OnInit {
  userId!: number;
  user: User = {} as User;
  teacherCourses: Course[] = []
  teacherClassrooms: Classroom[] = []

  availableCourses: Course[] = []
  availableClassrooms: Classroom[] = []

  constructor(
    private readonly route: ActivatedRoute,
    private adminService: AdminService,
    private courseService: CourseService,
    private classroomService: ClassroomService,
    private configService: ConfigService,
    private teacherService: TeacherService
  ) {
    this.userId = Number(this.route.snapshot.paramMap.get('userId'))
  }

  async ngOnInit() {
    await this.getUserDetails();
    await this.getTeacherCourses();
    await this.getTeacherClassrooms();
    await this.get_available_courses();
    await this.get_available_classrooms();
    setTimeout(() => {
      this.initPopovers();
    }, 300)
  }

  async getUserDetails() {
    (await this.adminService.get_user_by_id(this.userId))
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe(res => {
        this.user = res as User;
      })
  }

  async getTeacherCourses() {
    (await this.courseService.get_courses_by_teacher_id(this.userId))
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe(res => {
        this.teacherCourses = res as Course[];
      })
  }

  async getTeacherClassrooms() {
    (await this.classroomService.get_classrooms_by_teacher_id(this.userId))
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe(res => {
        this.teacherClassrooms = res as Classroom[];
      })
  }

  async get_available_courses() {
    (await this.courseService.get_courses())
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe(res => {
        let courses = res as Course[];
        this.availableCourses = courses.filter(
          course => !this.teacherCourses.map(
            course => course.id
          ).includes(course.id)
        );
      });
  }

  async get_available_classrooms() {
    (await this.classroomService.get_classrooms())
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe(async res => {
        let classrooms = res as Classroom[];
        this.availableClassrooms = classrooms.filter(
          classroom => !this.teacherClassrooms.map(
            classroom => classroom.id
          ).includes(classroom.id)
        );
        console.log(this.availableClassrooms.length);
      });
  }

  async assign_to_course() {
    let assign_to_course_input = document.getElementById('assign-course-input') as HTMLInputElement;
    if (!assign_to_course_input.value) {
      let err = {error: {message: "Something went wrong"}, status: 400};
      this.configService.errorHandler(err, true);
      return;
    }
    const course_name = assign_to_course_input.value;
    const course_id = this.availableCourses.find(
      course => course.name === course_name
    )?.id;
    if (course_id) {
      (await this.teacherService.assign_to_course(this.userId, course_id))
        .pipe(
          catchError(error => {
            this.configService.errorHandler(error, true)
            throw error
          })
        )
        .subscribe(() => {
          this.configService.successHandler("Course assigned successfully");
          this.getTeacherCourses();
          this.get_available_courses();
        })
    } else {
      this.configService.errorHandler("Course not found", true);
    }
  }

  async assign_to_classroom() {
    let assign_to_classroom_input = document.getElementById('assign-classroom-input') as HTMLInputElement;
    if (!assign_to_classroom_input.value) {
      let err = {error: {message: "Something went wrong"}, status: 400};
      this.configService.errorHandler(err, true);
      return;
    }
    const classroom_name = assign_to_classroom_input.value;
    const classroom_id = this.availableClassrooms.find(
      classroom => classroom.name === classroom_name
    )?.id;
    if (classroom_id) {
      (await this.teacherService.assign_to_classroom(this.userId, classroom_id))
        .pipe(
          catchError(error => {
            this.configService.errorHandler(error, true)
            throw error
          })
        )
        .subscribe(() => {
          this.configService.successHandler("Classroom assigned successfully");
          this.getTeacherClassrooms();
          this.get_available_classrooms();
        })
    } else {
      this.configService.errorHandler("Course not found", true);
    }
  }

  initPopovers() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    for (let i = 0; i < tooltipTriggerList.length; i++) {
      new Tooltip(tooltipTriggerList[i]);
    }
    console.log(this.availableClassrooms.length);
  }

  protected readonly document = document;
}
