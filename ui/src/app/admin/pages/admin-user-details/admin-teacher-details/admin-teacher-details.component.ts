import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {catchError} from "rxjs";
import {AdminService} from "../../../../services/api/admin/admin.service";
import {ConfigService} from "../../../../services/config/config.service";
import {User} from "../../../../interfaces/api/user";
import {ClassroomTableComponent} from "../../../../components/complex/classroom-table/classroom-table.component";
import {DatePipe, NgForOf} from "@angular/common";
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
    NgForOf
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
    await this.refresh_the_view();
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
        console.log(this.availableCourses);
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
      });
  }

  async assign_to_course() {
    let assign_to_course_input = document.getElementById('assign-course-input') as HTMLInputElement;
    if (assign_to_course_input.value == '') {
      let err = {error: {message: "Please enter the course name"}, status: 400};
      this.configService.errorHandler(err, true);
      return;
    }
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
        .subscribe(async () => {
          this.configService.successHandler("Course assigned successfully");
          assign_to_course_input.value = "";
          await this.refresh_the_view();
        })
    } else {
      let err = {error: {message: "Course not found"}, status: 404};
      this.configService.errorHandler(err, true);
    }

  }

  async unassign_course(course_id: number) {
    console.log("course_id to be deleted", course_id);
  }

  async assign_to_classroom() {
    let assign_to_classroom_input = document.getElementById('assign-classroom-input') as HTMLInputElement;
    if (assign_to_classroom_input.value == '') {
      let err = {error: {message: "Please enter the classroom name"}, status: 400};
      this.configService.errorHandler(err, true);
      return;
    }
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
        .subscribe(async () => {
          this.configService.successHandler("Classroom assigned successfully");
          assign_to_classroom_input.value = '';
          await this.refresh_the_view();
        })
    } else {
      let err = {error: {message: "Classroom not found"}, status: 404};
      this.configService.errorHandler(err, true);
    }
  }

  async unassign_classroom(classroom_id: number) {
    console.log("classroom_id to be deleted", classroom_id);
    (await this.teacherService.unassign_classroom(this.userId, classroom_id))
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe(async () => {
        this.configService.successHandler("Classroom unassigned successfully");
        await this.refresh_the_view();
      })
  }

  initPopovers() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    for (let i = 0; i < tooltipTriggerList.length; i++) {
      new Tooltip(tooltipTriggerList[i]);
    }
  }

  async refresh_the_view() {
    await this.getUserDetails();
    await this.getTeacherCourses();
    await this.getTeacherClassrooms();
    await this.get_available_courses();
    await this.get_available_classrooms();
    setTimeout(() => {
      this.initPopovers();
    }, 300)
  }


  protected readonly document = document;
}
