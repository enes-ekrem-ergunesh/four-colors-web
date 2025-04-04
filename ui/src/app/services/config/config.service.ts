import {Injectable} from '@angular/core';
import {AlertService} from "../alert/alert.service";
import {Alert} from "../../interfaces/ui/alert";
import {StorageService} from "../storage/storage.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(
    private alertService: AlertService,
    private storageService: StorageService,
    private router: Router,
  ) {
  }

  public async authHeader(isAdmin: boolean = false) {
    const token = await this.storageService.get(isAdmin ? 'admin_token' : 'token');
    return {headers: {Authorization: token}}
  }

  public addAlert(message: string, type: string, timeout: number | null = null) {
    const alert: Alert = {
      message: message,
      type: type,
      timeout: timeout
    }
    this.alertService.addAlert(alert)
  }

  public errorHandler(error: any, isAdmin: boolean = false, logout: boolean = true) {
    let alertMessage = 'Unknown error, please try again'
    let alertType = 'danger'
    let alertTimeout: number | null = null
    if (error.status === 0) {
      alertType = 'danger'
    } else if (error.status < 200) {
      alertType = 'info'
      alertTimeout = 2000
    } else if (error.status < 300) {
      alertType = 'success'
      alertTimeout = 2000
    } else if (error.status < 400) {
      alertType = 'warning'
      alertTimeout = 3000
    } else if (error.status < 500) {
      alertType = 'danger'
      alertTimeout = 3000
    } else {
      alertType = 'danger'
    }
    if (error.error && error.error.message) {
      alertMessage = error.error.message
    }
    this.addAlert(alertMessage, alertType, alertTimeout)
    // console.warn(error.status)
    if (error.status === 401 && logout) {
      this.storageService.remove(isAdmin? 'admin_token' : 'token')
      this.router.navigate([isAdmin? '/admin-login': '/login']).then()
    }
    if (error.status === 403) {
      this.router.navigate(['/home']).then()
    }
  }

}
