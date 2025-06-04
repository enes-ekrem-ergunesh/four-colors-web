import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NavbarComponent} from "../../../components/complex/navbar/navbar.component";
import {Nav} from "../../../interfaces/ui/nav";
import {CommonTsService} from "../../../services/common-ts/common-ts.service";
import {User} from "../../../interfaces/api/user";
import {AdminService} from "../../../services/api/admin/admin.service";
import {ConfigService} from "../../../services/config/config.service";
import {catchError} from "rxjs";
import {AdminStudentDetailsComponent} from "./admin-student-details/admin-student-details.component";
import {AdminAdminDetailsComponent} from "./admin-admin-details/admin-admin-details.component";
import {AdminTeacherDetailsComponent} from "./admin-teacher-details/admin-teacher-details.component";

@Component({
  selector: 'app-admin-user-details',
  templateUrl: './admin-user-details.page.html',
  styleUrls: ['./admin-user-details.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, AdminStudentDetailsComponent, AdminAdminDetailsComponent, AdminTeacherDetailsComponent]
})
export class AdminUserDetailsPage implements OnInit {
  navs!: Nav[];
  user: User = {
    id: 0,
    email: '',
    first_name: '',
    last_name: '',
    nationality: '',
    birthdate: '',
    gender: '',
    type: null
  };
  user_id!: number;
  @Input()
  set userId(userId_str: string) {
    let userId = 0
    try {
      userId = parseInt(userId_str);
    }
    catch (error) {
      console.error(error);
    }
    this.user_id = userId;
  }

  constructor(
    common_ts: CommonTsService,
    private adminService: AdminService,
    private configService: ConfigService,
  ) {
    this.navs = common_ts.admin_navs
  }

  async ngOnInit() {
    (await this.adminService.get_user_by_id(this.user_id))
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe(response => {
        this.user = response as User;
      })
  }

}
