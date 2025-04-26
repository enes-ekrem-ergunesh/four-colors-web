import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {User} from "../../../interfaces/api/user";
import {Nav} from "../../../interfaces/ui/nav";
import {AdminService} from "../../../services/api/admin/admin.service";
import {ConfigService} from "../../../services/config/config.service";
import {catchError} from "rxjs";
import {NavbarComponent} from "../../../components/complex/navbar/navbar.component";
import {UserTableComponent} from "../../../components/complex/user-table/user-table.component";
import {CommonTsService} from "../../../services/common-ts/common-ts.service";

@Component({
  selector: 'app-admin-students',
  templateUrl: './admin-students.page.html',
  styleUrls: ['./admin-students.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, UserTableComponent]
})
export class AdminStudentsPage implements OnInit {
  navs!: Nav[]
  users: User[] = [];

  constructor(
    common_ts: CommonTsService,
    private adminService: AdminService,
    private configService: ConfigService,
  ) {
    this.navs = common_ts.admin_navs
  }

  async ngOnInit() {
    (await this.adminService.get_students())
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe((response) => {
        this.users = response as User[];
      })
  }

}
