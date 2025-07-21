import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Nav} from "../../../interfaces/ui/nav";
import {NavbarComponent} from "../../../components/complex/navbar/navbar.component";
import {firstValueFrom} from "rxjs";
import {User} from "../../../interfaces/api/user";
import {UserService} from "../../../services/api/user/user.service";
import {ConfigService} from "../../../services/config/config.service";
import {StudentHomeComponent} from "../student/student-home/student-home.component";
import {TeacherHomeComponent} from "../teacher/teacher-home/teacher-home.component";
import {StudentCoursesComponent} from "../student/student-courses/student-courses.component";
import {TeacherCoursesComponent} from "../teacher/teacher-courses/teacher-courses.component";

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.page.html',
  styleUrls: ['./my-courses.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, StudentHomeComponent, TeacherHomeComponent, StudentCoursesComponent, TeacherCoursesComponent]
})
export class MyCoursesPage implements OnInit {
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
