import { Component, OnInit } from '@angular/core';
import {Alert} from "../../interfaces/ui/alert";
import {AlertService} from "../../services/alert/alert.service";
import {NgForOf} from "@angular/common";
import {IonIcon} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {informationCircle, checkmarkCircle, warning} from "ionicons/icons";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  standalone: true,
  imports: [
    NgForOf,
    IonIcon
  ]
})
export class AlertComponent  implements OnInit {
  alerts : Alert[] = []

  constructor(
    private alertService: AlertService
  ) {
    addIcons({informationCircle, checkmarkCircle, warning});
  }

  ngOnInit() {
    this.alertService.alerts.subscribe((alerts: Alert[]) => {
      this.alerts = alerts
    })
  }

  alertIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'checkmark-circle'
      case 'info':
        return 'information-circle'
      default:
        return 'warning'
    }
  }

  alertTheme(type: string): string {
    switch (type) {
      case 'success':
        return 'alert-success'
      case 'info':
        return 'alert-primary'
      case 'warning':
        return 'alert-warning'
      default:
        return 'alert-danger'
    }
  }

  dismissAlert(alert: Alert) {
    this.alertService.removeAlert(alert)
  }

}
