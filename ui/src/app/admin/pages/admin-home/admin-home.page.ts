import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {NavbarComponent} from "../../../components/complex/navbar/navbar.component";
import {AlertService} from "../../../services/alert/alert.service";
import {Alert} from "../../../interfaces/ui/alert";
import {UserTableComponent} from "../../../components/complex/user-table/user-table.component";

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.page.html',
  styleUrls: ['./admin-home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, UserTableComponent]
})
export class AdminHomePage implements OnInit {

  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit() {

  }

}
