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
  getFormValidationError(control: string, formGroup: FormGroup) {
    const errors = formGroup.get(control)?.errors
    if (!errors) {
      return null
    }
    const errors_array = errors as { [key: string]: any }
    const error = Object.keys(errors_array)[0]

    switch (control) {
      case 'email':
        if (error === 'required') {
          return 'Email is required'
        } else {
          return 'Email is invalid'
        }
      case 'password':
        if (error === 'required') {
          return 'Password is required'
        } else if (error === 'minlength') {
          return 'Password must be at least 8 characters long'
        } else if (error === 'pattern') {
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
        } else {
          return 'Password is invalid'
        }
      case 'first_name':
        if (error === 'required') {
          return 'First name is required'
        } else {
          return 'First name is invalid'
        }
      case 'last_name':
        if (error === 'required') {
          return 'Last name is required'
        } else {
          return 'Last name is invalid'
        }
      case 'nationality':
        return 'Nationality is invalid'
      case 'birthdate':
        return 'Birthdate is invalid'
      case 'gender':
        return 'Gender is invalid'
      default:
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
