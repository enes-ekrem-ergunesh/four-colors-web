import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Alert} from "../../interfaces/ui/alert";

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  alerts = new BehaviorSubject<Alert[]>([]);

  constructor() { }

  addAlert(alert: Alert) {
    this.alerts.next([...this.alerts.value, alert])
    if (alert.timeout)
    setTimeout(() => {
      let alerts = this.alerts.value
      alerts.splice(alerts.indexOf(alert), 1)
      this.alerts.next(alerts)
    }, alert.timeout)
  }

  removeAlert(alert: Alert) {
    // if alert not exists
    if (!this.alerts.value.includes(alert)) return

    let alerts = this.alerts.value
    alerts.splice(alerts.indexOf(alert), 1)
    this.alerts.next(alerts)
  }

}
