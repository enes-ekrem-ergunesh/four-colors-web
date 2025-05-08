import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink, RouterLinkActive, ClassroomTableComponent]
})
export class AdminClassroomsPage implements OnInit {
  navs!: Nav[]
  classrooms: Classroom[] = [];

  constructor(
    common_ts: CommonTsService,
    private classroomService: ClassroomService,
    private configService: ConfigService,
  ) {
    this.navs = common_ts.admin_navs
  }

  async ngOnInit() {
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

}
