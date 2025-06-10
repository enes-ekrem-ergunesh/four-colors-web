import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../../config/config.service";

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  api_url = environment.api_url;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) {
  }

  async get_teachers_by_course_id(course_id: number) {
    return this.http.get(this.api_url + '/teacher/course/' + course_id,
      await this.configService.authHeader(true))
  }

  async assign_to_course(teacher_id: number, course_id: number) {
    return this.http.post(this.api_url + '/teacher/course/', {
        "teacher_id": teacher_id,
        "course_id": course_id
      },
      await this.configService.authHeader(true))
  }

  async assign_to_classroom(teacher_id: number, classroom_id: number) {
    return this.http.post(this.api_url + '/teacher/classroom/', {
        "teacher_id": teacher_id,
        "classroom_id": classroom_id
      },
      await this.configService.authHeader(true))
  }
}
