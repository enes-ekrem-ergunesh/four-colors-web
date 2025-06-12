import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {catchError, firstValueFrom} from "rxjs";
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
export class AdminTeacherDetailsComponent implements OnInit, AfterViewChecked {
  userId!: number;
  user: User = {} as User;
  teacherCourses: Course[] = []
  teacherClassrooms: Classroom[] = []

  availableCourses: Course[] = []
  previousAvailableCoursesLength = 0
  availableClassrooms: Classroom[] = []
  previousAvailableClassroomsLength = 0

  tooltipList: Tooltip[] = []
  needsTooltipUpdate = true;

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

  ngAfterViewChecked(): void {
    if (this.availableCourses.length !== this.previousAvailableCoursesLength) {
      this.needsTooltipUpdate = true;
      this.previousAvailableCoursesLength = this.availableCourses.length;
    }

    if (this.availableClassrooms.length !== this.previousAvailableClassroomsLength) {
      this.needsTooltipUpdate = true;
      this.previousAvailableClassroomsLength = this.availableClassrooms.length;
    }

    if (this.needsTooltipUpdate) {
      setTimeout(() => {
        this.initTooltips();
        this.needsTooltipUpdate = false;
      }, 0);
    }
  }

  async getUserDetails() {
    let res = await firstValueFrom((await this.adminService.get_user_by_id(this.userId))
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
    )
    this.user = res as User;
  }

  async getTeacherCourses() {
    let res = await firstValueFrom((await this.courseService.get_courses_by_teacher_id(this.userId))
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
    )
    this.teacherCourses = res as Course[];
  }

  async getTeacherClassrooms() {
    let res = await firstValueFrom((await this.classroomService.get_classrooms_by_teacher_id(this.userId))
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
    )
    this.teacherClassrooms = res as Classroom[];
  }

  async get_available_courses() {
    let res = await firstValueFrom((await this.courseService.get_courses())
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
    )
    let courses = res as Course[];
    this.availableCourses = courses.filter(
      course => !this.teacherCourses.map(
        course => course.id
      ).includes(course.id)
    );
  }

  async get_available_classrooms() {
    console.log("RUNNER 0")
    let res = await firstValueFrom((await this.classroomService.get_classrooms())
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
    )
    console.log("RUNNER 1")
    let classrooms = res as Classroom[];
    this.availableClassrooms = classrooms.filter(
      classroom => !this.teacherClassrooms.map(
        classroom => classroom.id
      ).includes(classroom.id)
    );
    console.log("RUNNER 2", this.availableClassrooms.length)
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
        });
    } else {
      let err = {error: {message: "Course not found"}, status: 404};
      this.configService.errorHandler(err, true);
    }

  }

  async unassign_course(course_id: number) {
    (await this.teacherService.unassign_course(this.userId, course_id))
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe(async () => {
        this.configService.successHandler("Course unassigned successfully");
        await this.refresh_the_view();
      })
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

  initTooltips() {
    console.log("RUNNER 3")
    for (let i = 0; i < this.tooltipList.length; i++) {
      this.tooltipList[i].dispose()
    }
    this.tooltipList = [];
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    console.log(tooltipTriggerList);
    for (let i = 0; i < tooltipTriggerList.length; i++) {
      this.tooltipList.push(new Tooltip(tooltipTriggerList[i]));
    }
  }

  async refresh_the_view() {
    await this.getUserDetails();
    await this.getTeacherCourses();
    await this.getTeacherClassrooms();
    await this.get_available_courses();
    await this.get_available_classrooms();
  }


  protected readonly document = document;
}
