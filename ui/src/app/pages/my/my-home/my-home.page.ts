import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NavbarComponent} from "../../../components/complex/navbar/navbar.component";
import {Nav} from "../../../interfaces/ui/nav";
import {User} from "../../../interfaces/api/user";
import {UserService} from "../../../services/api/user/user.service";
import {catchError, firstValueFrom} from "rxjs";
import {ConfigService} from "../../../services/config/config.service";
import {StudentHomeComponent} from "../student/student-home/student-home.component";
import {TeacherHomeComponent} from "../teacher/teacher-home/teacher-home.component";

@Component({
  selector: 'app-my-home',
  templateUrl: './my-home.page.html',
  styleUrls: ['./my-home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, StudentHomeComponent, TeacherHomeComponent]
})
export class MyHomePage implements OnInit {
  currentUser = {} as User;
  navs: Nav[] = [
    {
      name: 'Dashboard',
      route: '/my-home',
    },
    {
      name: 'My Courses',
      route: '/my-courses',
    },
  ]

  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) { }

  async ngOnInit() {
    const user = await firstValueFrom(await this.userService.get_self());
    this.currentUser = user as User;
  }

}
