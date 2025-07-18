import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../../config/config.service";

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  api_url = environment.api_url;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) {
  }

  async get_students_by_classroom_id(classroom_id: number) {
    return this.http.get(this.api_url + '/student/classroom/' + classroom_id,
      await this.configService.authHeader(true))
  }

  async assign_to_classroom(student_id: number, classroom_id: number) {
    return this.http.post(this.api_url + '/student/classroom/', {
        "student_id": student_id,
        "classroom_id": classroom_id
      },
      await this.configService.authHeader(true))
  }

  async unassign_classroom(student_id: number, classroom_id: number) {
    const headers = (await this.configService.authHeader(true))['headers']
    return this.http.delete(this.api_url + '/student/classroom/',
      {
        headers: headers, body: {
          "student_id": student_id,
          "classroom_id": classroom_id
        }
      })
  }

}
