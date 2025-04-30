import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../../config/config.service";

@Injectable({
  providedIn: 'root'
})
export class NationalityService {
  api_url = environment.api_url;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) { }

  getAllCountries() {
    return this.http.get(`${this.api_url}/nationality/`)
  }
}
