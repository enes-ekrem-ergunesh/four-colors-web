import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../../config/config.service";
import {NewClassroom} from "../../../interfaces/api/new-classroom";

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  api_url = environment.api_url;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) { }

  async get_classrooms() {
    return this.http.get(this.api_url + '/classroom/', await this.configService.authHeader(true))
  }

  async get_classrooms_by_course_id(course_id: number) {
    return this.http.get(this.api_url + '/classroom/course/'+course_id, await this.configService.authHeader(true))
  }

  async get_classrooms_by_teacher_id(teacher_id: number) {
    return this.http.get(this.api_url + '/classroom/teacher/'+teacher_id, await this.configService.authHeader(true))
  }

  async new_classroom(classroom: NewClassroom) {
    return this.http.post(this.api_url + '/classroom/', classroom, await this.configService.authHeader(true))
  }

  async soft_delete_classroom(classroom_id: number) {
    return this.http.delete(this.api_url + '/classroom/' + classroom_id, await this.configService.authHeader(true))
  }

}
