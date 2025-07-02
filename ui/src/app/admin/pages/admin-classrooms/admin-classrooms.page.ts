import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Nav} from "../../../interfaces/ui/nav";
import {CommonTsService} from "../../../services/common-ts/common-ts.service";
import {ConfigService} from "../../../services/config/config.service";
import {catchError} from "rxjs";
import {Classroom} from "../../../interfaces/api/classroom";
import {ClassroomService} from "../../../services/api/classroom/classroom.service";
import {NavbarComponent} from "../../../components/complex/navbar/navbar.component";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {ClassroomTableComponent} from "../../../components/complex/classroom-table/classroom-table.component";

@Component({
  selector: 'app-admin-classrooms',
  templateUrl: './admin-classrooms.page.html',
  styleUrls: ['./admin-classrooms.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink, RouterLinkActive, ClassroomTableComponent, ReactiveFormsModule]
})
export class AdminClassroomsPage implements OnInit {
  navs!: Nav[]
  classrooms: Classroom[] = [];
  show_deleted_classrooms = new FormControl<boolean>(true);

  constructor(
    common_ts: CommonTsService,
    private classroomService: ClassroomService,
    private configService: ConfigService,
  ) {
    this.navs = common_ts.admin_navs
  }

  async ngOnInit() {
    await this.get_classrooms()
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

  async get_classrooms(){
    (await this.classroomService.get_classrooms())
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe((response) => {
        this.classrooms = response as Classroom[];
      })
  }

  async refresh_the_view(){
    await this.get_classrooms()
  }

  filter_classrooms() {
    if (this.show_deleted_classrooms.value) {
      return this.classrooms
    }
    return this.classrooms.filter(classroom => classroom.deleted_at === null)
  }
}
