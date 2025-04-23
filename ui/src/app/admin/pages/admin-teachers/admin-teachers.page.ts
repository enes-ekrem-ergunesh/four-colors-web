import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {Nav} from "../../../interfaces/ui/nav";
import {NavbarComponent} from "../../../components/complex/navbar/navbar.component";
import {UserTableComponent} from "../../../components/complex/user-table/user-table.component";

@Component({
  selector: 'app-admin-teachers',
  templateUrl: './admin-teachers.page.html',
  styleUrls: ['./admin-teachers.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, NavbarComponent, UserTableComponent]
})
export class AdminTeachersPage implements OnInit {
  navs: Nav[] = [
    {
      name: 'Dashboard',
      route: '/admin-home',
    },
    {
      name: 'Teachers',
      route: '/admin-teachers',
    },
    {
      name: 'Students',
      route: '/admin-students',
    },
  ]

  constructor() { }

  ngOnInit() {
    return
  }

}
