import {Injectable} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../../config/config.service";
import {Login} from "../../../interfaces/api/login";
import {catchError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  api_url = environment.api_url;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) {
  }

  /* Login & Register */
  getFormValidationError(control: string, formGroup: FormGroup, form: string) {
    const errors = formGroup.get(control)?.errors
    if (!errors) {
      return null
    }
    const errors_array = errors as { [key: string]: any }
    const error = Object.keys(errors_array)[0]
    let control_names : { [key: string]: any } = {};
    switch (form) {
      case 'login':
        control_names = {
          email: 'Email',
          password: 'Password',
          remember_me: 'Remember Me',
        }
        break
      case 'new-user':
        control_names = {
          email: 'Email',
          password: 'Password',
          first_name: 'First name',
          last_name: 'Last name',
          nationality: 'Nationality',
          birthdate: 'Birthdate',
          gender: 'Gender',
        }
        break
      case 'new-course':
        control_names = {
          name: 'Course name',
          description: 'Course description',
        }
        break

    }

    if (error === 'required') {
      if (control in control_names){
        // @ts-ignore
        return control_names[control] + ' is required'
      }
      else{
        return 'Required input'
      }
    }

    switch (control) {
      case 'password':
        if (error === 'minlength') {
          return 'Password must be at least 8 characters long'
        } else {
          let password = formGroup.get('password')?.value
          if (!/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter'
          } else if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter'
          } else if (!/\d/.test(password)) {
            return 'Password must contain at least one number'
          } else {
            return 'Password must contain at least one special character'
          }
        }
      default:
        if (control in control_names) {
          // @ts-ignore
          return control_names[control] + ' is invalid'
        }
        return 'Invalid input'
    }
  }

  isPasswordErrorDisplayed() {
    const errorTexts = document.getElementsByClassName('error-text')
    for (let i = 0; i < errorTexts.length; i++) {
      if (errorTexts[i].parentElement?.parentElement?.id === 'password-ion-input') {
        const display = window.getComputedStyle(errorTexts[i]).display
        if (display === 'block') {
          return true
        }
      }
    }
    return false
  }

  login(data: Login) {
    return this.http.post(this.api_url + '/auth/login', data)
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, false, false)
          throw error
        })
      )
  }

  async logout() {
    return this.http.post(this.api_url + '/auth/logout', {}, await this.configService.authHeader())
  }

}
