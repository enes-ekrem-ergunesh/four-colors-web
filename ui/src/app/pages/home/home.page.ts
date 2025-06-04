import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../../components/complex/navbar/navbar.component";
import {Nav} from "../../interfaces/ui/nav";
import {StorageService} from "../../services/storage/storage.service";
import {User} from "../../interfaces/api/user";
import {Token} from "../../interfaces/api/token";
import {UserService} from "../../services/api/user/user.service";
import {catchError} from "rxjs";
import {ConfigService} from "../../services/config/config.service";
import {HomeCarouselComponent} from "./home-carousel/home-carousel.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [NavbarComponent, HomeCarouselComponent],
})
export class HomePage implements OnInit {
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
  ) {
  }

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
