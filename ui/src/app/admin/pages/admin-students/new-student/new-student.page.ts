import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormGroup, FormsModule} from '@angular/forms';
import {NavbarComponent} from "../../../../components/complex/navbar/navbar.component";
import {Nav} from "../../../../interfaces/ui/nav";
import {CommonTsService} from "../../../../services/common-ts/common-ts.service";
import {AdminService} from "../../../../services/api/admin/admin.service";
import {ConfigService} from "../../../../services/config/config.service";
import {NewUser} from "../../../../interfaces/api/new-user";
import {catchError} from "rxjs";
import {NewUserFormComponent} from "../../../../components/form/new-user-form/new-user-form.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-student',
  templateUrl: './new-student.page.html',
  styleUrls: ['./new-student.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, NewUserFormComponent]
})
export class NewStudentPage implements OnInit {
  navs!: Nav[]

  constructor(
    common_ts: CommonTsService,
    private adminService: AdminService,
    private configService: ConfigService,
    private router: Router,
  ) {
    this.navs = common_ts.admin_navs
  }

  ngOnInit() {
    return
  }

  async add_student(user_form: FormGroup) {
    let newUser: NewUser = {
      email: user_form.get('email')?.value,
      password: user_form.get('password')?.value,
      first_name: user_form.get('first_name')?.value,
      last_name: user_form.get('last_name')?.value,
      nationality: user_form.get('nationality')?.value,
      birthdate: user_form.get('birthdate')?.value,
      gender: user_form.get('gender')?.value
    };
    (await this.adminService.new_student(newUser))
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe(res => {
        console.log(res)
        this.configService.successHandler("Student created successfully")
        this.router.navigate(['/admin-students'])
      })
  }

}
