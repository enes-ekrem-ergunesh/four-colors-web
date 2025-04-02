import {Injectable} from '@angular/core';
import {AdminLogin} from "../../../admin/interfaces/admin-login";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {catchError} from "rxjs";
import {ConfigService} from "../../config/config.service";

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

}
