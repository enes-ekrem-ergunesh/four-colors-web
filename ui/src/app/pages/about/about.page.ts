import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Nav} from "../../interfaces/ui/nav";
import {NavbarComponent} from "../../components/complex/navbar/navbar.component";
import {User} from "../../interfaces/api/user";
import {StorageService} from "../../services/storage/storage.service";
import {UserService} from "../../services/api/user/user.service";
import {ConfigService} from "../../services/config/config.service";
import {catchError} from "rxjs";
import {AboutWhoWeAreComponent} from "./about-who-we-are/about-who-we-are.component";
import {AboutIdeaComponent} from "./about-idea/about-idea.component";
import {AboutTimelineComponent} from "./about-timeline/about-timeline.component";

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, AboutWhoWeAreComponent, AboutIdeaComponent, AboutTimelineComponent]
})
export class AboutPage implements OnInit {
  navs: Nav[] = [
    {
      name: 'Home',
      route: '/home',
    },
    {
      name: 'Courses',
      route: '/courses',
      dropdown: [
        {
          name: 'English',
          route: '/courses/english'
        },
        {
          name: 'Math',
          route: '/courses/math'
        },
        {
          name: 'Science',
          route: '/courses/science'
        },
      ]
    },
    {
      name: 'Contact',
      route: '/contact',
    },
    {
      name: 'About',
      route: '/about',
    },
  ]
  user: User | null = null;

  constructor(
    private storageService: StorageService,
    private userService: UserService,
    private configService: ConfigService,
    ) { }

  async ngOnInit() {
    const token = await this.storageService.get('token')
    if (token) {
      (await this.userService.get_self())
        .pipe(
          catchError(error => {
            this.configService.errorHandler(error, false, false)
            throw error
          })
        )
        .subscribe(user => {
          this.user = user as User
        })
    }
  }

}
