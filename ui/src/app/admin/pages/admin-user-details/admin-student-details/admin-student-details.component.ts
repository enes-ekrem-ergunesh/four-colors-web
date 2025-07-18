import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {User} from "../../../../interfaces/api/user";
import {Classroom} from "../../../../interfaces/api/classroom";
import {Tooltip} from "bootstrap";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {AdminService} from "../../../../services/api/admin/admin.service";
import {ClassroomService} from "../../../../services/api/classroom/classroom.service";
import {ConfigService} from "../../../../services/config/config.service";
import {StudentService} from "../../../../services/api/student/student.service";
import {catchError, firstValueFrom} from "rxjs";
import {ClassroomTableComponent} from "../../../../components/complex/classroom-table/classroom-table.component";
import {DatePipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-admin-student-details',
  templateUrl: './admin-student-details.component.html',
  styleUrls: ['./admin-student-details.component.scss'],
  imports: [
    ClassroomTableComponent,
    DatePipe,
    NgForOf,
    RouterLink
  ],
  standalone: true
})
export class AdminStudentDetailsComponent  implements OnInit, AfterViewChecked {
  userId!: number;
  user: User = {} as User;
  studentClassrooms: Classroom[] = []

  availableClassrooms: Classroom[] = []
  previousAvailableClassroomsLength = 0

  tooltipList: Tooltip[] = []
  needsTooltipUpdate = true;

  constructor(
    private readonly route: ActivatedRoute,
    private adminService: AdminService,
    private classroomService: ClassroomService,
    private configService: ConfigService,
    private studentService: StudentService
  ) {
    this.userId = Number(this.route.snapshot.paramMap.get('userId'))
  }

  async ngOnInit() {
    await this.refresh_the_view();
  }

  ngAfterViewChecked(): void {
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

  async getStudentClassrooms() {
    let res = await firstValueFrom((await this.classroomService.get_classrooms_by_student_id(this.userId))
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
    )
    this.studentClassrooms = res as Classroom[];
  }

  async get_available_classrooms() {
    let res = await firstValueFrom((await this.classroomService.get_classrooms())
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
    )
    let classrooms = res as Classroom[];
    this.availableClassrooms = classrooms.filter(
      classroom => !this.studentClassrooms.map(
        classroom => classroom.id
      ).includes(classroom.id)
    );
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
      (await this.studentService.assign_to_classroom(this.userId, classroom_id))
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
    (await this.studentService.unassign_classroom(this.userId, classroom_id))
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
    for (let i = 0; i < this.tooltipList.length; i++) {
      this.tooltipList[i].dispose()
    }
    this.tooltipList = [];
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')

    for (let i = 0; i < tooltipTriggerList.length; i++) {
      this.tooltipList.push(new Tooltip(tooltipTriggerList[i]));
    }
  }

  async refresh_the_view() {
    await this.getUserDetails();
    await this.getStudentClassrooms();
    await this.get_available_classrooms();
  }


}
