import {Injectable} from '@angular/core';
import {AdminLogin} from "../../../admin/interfaces/admin-login";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {catchError} from "rxjs";
import {ConfigService} from "../../config/config.service";
import {NewUser} from "../../../interfaces/api/new-user";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  api_url = environment.api_url;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
  }

  login(data: AdminLogin) {
    return this.http.post(this.api_url + '/admin/login', data)
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
  }

  async logout(){
    return this.http.post(this.api_url + '/auth/logout', {}, await this.configService.authHeader(true))
  }

  async validate() {
    return this.http.get(this.api_url + '/admin/validate', await this.configService.authHeader(true))
  }

  async get_students() {
    return this.http.get(this.api_url + '/admin/students', await this.configService.authHeader(true))
  }

  async new_student(new_student: NewUser) {
    return this.http.post(this.api_url + '/admin/students', new_student, await this.configService.authHeader(true))
  }

  async get_teachers() {
    return this.http.get(this.api_url + '/admin/teachers', await this.configService.authHeader(true))
  }

  async new_teacher(new_teacher: NewUser) {
    return this.http.post(this.api_url + '/admin/teachers', new_teacher, await this.configService.authHeader(true))
  }

  async get_user_by_id(user_Id: number){
    return this.http.get(this.api_url + '/admin/user/' + user_Id, await this.configService.authHeader(true))
  }


}
