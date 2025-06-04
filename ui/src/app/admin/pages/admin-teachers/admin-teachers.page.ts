import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Nav} from "../../../interfaces/ui/nav";
import {NavbarComponent} from "../../../components/complex/navbar/navbar.component";
import {UserTableComponent} from "../../../components/complex/user-table/user-table.component";
import {CommonTsService} from "../../../services/common-ts/common-ts.service";
import {User} from "../../../interfaces/api/user";
import {AdminService} from "../../../services/api/admin/admin.service";
import {ConfigService} from "../../../services/config/config.service";
import {catchError} from "rxjs";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-admin-teachers',
  templateUrl: './admin-teachers.page.html',
  styleUrls: ['./admin-teachers.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, UserTableComponent, RouterLink, RouterLinkActive]
})
export class AdminTeachersPage implements OnInit {
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
    (await this.adminService.get_teachers())
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
