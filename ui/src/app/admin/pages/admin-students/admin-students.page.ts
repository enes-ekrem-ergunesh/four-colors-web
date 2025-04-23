import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {User} from "../../../interfaces/api/user";
import {Nav} from "../../../interfaces/ui/nav";
import {AdminService} from "../../../services/api/admin/admin.service";
import {ConfigService} from "../../../services/config/config.service";
import {catchError} from "rxjs";
import {NavbarComponent} from "../../../components/complex/navbar/navbar.component";
import {UserTableComponent} from "../../../components/complex/user-table/user-table.component";

@Component({
  selector: 'app-admin-students',
  templateUrl: './admin-students.page.html',
  styleUrls: ['./admin-students.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, NavbarComponent, UserTableComponent]
})
export class AdminStudentsPage implements OnInit {
  users: User[] = [];
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

  constructor(
    private adminService: AdminService,
    private configService: ConfigService
  ) { }

  async ngOnInit() {
    (await this.adminService.get_students())
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe((response) => {
        this.users = response as User[];
      })
  }

}
