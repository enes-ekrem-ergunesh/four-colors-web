import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {StorageService} from "../../storage/storage.service";
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
}
