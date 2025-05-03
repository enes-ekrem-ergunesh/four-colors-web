import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormGroup, FormsModule} from '@angular/forms';
import {Nav} from "../../../../interfaces/ui/nav";
import {CommonTsService} from "../../../../services/common-ts/common-ts.service";
import {AdminService} from "../../../../services/api/admin/admin.service";
import {ConfigService} from "../../../../services/config/config.service";
import {NavbarComponent} from "../../../../components/complex/navbar/navbar.component";
import {NewUserFormComponent} from "../../../../components/form/new-user-form/new-user-form.component";
import {NewUser} from "../../../../interfaces/api/new-user";
import {catchError} from "rxjs";

@Component({
  selector: 'app-new-teacher',
  templateUrl: './new-teacher.page.html',
  styleUrls: ['./new-teacher.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, NewUserFormComponent]
})
export class NewTeacherPage implements OnInit {
  navs!: Nav[]

  constructor(
    common_ts: CommonTsService,
    private adminService: AdminService,
    private configService: ConfigService,
  ) {
    this.navs = common_ts.admin_navs
  }

  ngOnInit() {
    return
  }

  async add_teacher(user_form: FormGroup) {
    let newUser: NewUser = {
      email: user_form.get('email')?.value,
      password: user_form.get('password')?.value,
      first_name: user_form.get('first_name')?.value,
      last_name: user_form.get('last_name')?.value,
      nationality: user_form.get('nationality')?.value,
      birthdate: user_form.get('birthdate')?.value,
      gender: user_form.get('gender')?.value
    };
    (await this.adminService.new_teacher(newUser))
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe(res => {
        console.log(res)
      })
  }

}
