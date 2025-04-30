import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormGroup, FormsModule} from '@angular/forms';
import {IonContent, IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {NewStudentFormComponent} from "../../../../components/form/new-student-form/new-student-form.component";
import {NavbarComponent} from "../../../../components/complex/navbar/navbar.component";
import {Nav} from "../../../../interfaces/ui/nav";
import {CommonTsService} from "../../../../services/common-ts/common-ts.service";
import {AdminService} from "../../../../services/api/admin/admin.service";
import {ConfigService} from "../../../../services/config/config.service";
import {NewUser} from "../../../../interfaces/api/new-user";
import {catchError} from "rxjs";

@Component({
  selector: 'app-new-student',
  templateUrl: './new-student.page.html',
  styleUrls: ['./new-student.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NewStudentFormComponent, NavbarComponent]
})
export class NewStudentPage implements OnInit {
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

  async add_student(student_form: FormGroup) {
    let newStudent: NewUser = {
      email: student_form.get('email')?.value,
      password: student_form.get('password')?.value,
      first_name: student_form.get('first_name')?.value,
      last_name: student_form.get('last_name')?.value,
      nationality: student_form.get('nationality')?.value,
      birthdate: student_form.get('birthdate')?.value,
      gender: student_form.get('gender')?.value
    };
    (await this.adminService.new_student(newStudent))
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
