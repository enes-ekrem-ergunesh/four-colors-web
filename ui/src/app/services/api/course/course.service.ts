import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../../config/config.service";
import {NewCourse} from "../../../interfaces/api/new-course";

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  api_url = environment.api_url;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) { }

  async get_courses() {
    return this.http.get(this.api_url + '/course/', await this.configService.authHeader(true))
  }

  async new_course(course: NewCourse) {
    return this.http.post(this.api_url + '/course/', course, await this.configService.authHeader(true))
  }

  async get_course_by_id(course_id: number){
    return this.http.get(this.api_url + '/course/' + course_id, await this.configService.authHeader(true))
  }

  async get_courses_by_teacher_id(teacher_id: number){
    return this.http.get(this.api_url + '/course/teacher/' + teacher_id, await this.configService.authHeader(true))
  }

}
