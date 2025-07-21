import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {StorageService} from "../../storage/storage.service";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../../config/config.service";
import {BehaviorSubject, catchError} from "rxjs";
import {User} from "../../../interfaces/api/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  api_url = environment.api_url;

  constructor(
    private storageService: StorageService,
    private http: HttpClient,
    private configService: ConfigService,
  ) { }

  async get_self() {
    return this.http.get(this.api_url + '/user/self', await this.configService.authHeader())
  }

  async validate() {
    return this.http.get(this.api_url + '/user/validate', await this.configService.authHeader())
  }
}
