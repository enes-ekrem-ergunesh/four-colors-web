import {Component, input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Nav} from "../../../interfaces/ui/nav";
import {NgForOf, NgIf} from "@angular/common";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../../../services/api/auth/auth.service";
import {StorageService} from "../../../services/storage/storage.service";
import {ConfigService} from "../../../services/config/config.service";
import {catchError} from "rxjs";
import {AdminService} from "../../../services/api/admin/admin.service";
import {UserService} from "../../../services/api/user/user.service";
import {User} from "../../../interfaces/api/user";
import {Dropdown} from "bootstrap";
import {Collapse} from "bootstrap";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    RouterLinkActive
  ],
  standalone: true
})
export class NavbarComponent implements OnInit, OnChanges {
  navs = input<Nav[]>([{
    name: 'Home',
    route: '/home'
  }])
  active_nav = input<number>(0)
  search = input<boolean>(false)
  login = input<boolean>(false)
  logout = input<boolean>(false)
  profile_page = input<boolean>(false)
  is_admin_page = input<boolean>(false)

  userName = ''
  dropdownList: Dropdown[] = []
  navbarCollapse: Collapse | undefined

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router,
    private storageService: StorageService,
    private configService: ConfigService,
    private userService: UserService
  ) {
  }

  async ngOnInit() {
    if (this.profile_page()) {
      await this.getUserName()
    }

    setTimeout(() => {
      const dropdownElementList = document.querySelectorAll('.dropdown-toggle')
      if (dropdownElementList) {
        for (let i = 0; i < dropdownElementList.length; i++) {
          const dropdown = new Dropdown(dropdownElementList[i])
          this.dropdownList.push(dropdown)
        }
      }
    }, 500)
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (this.profile_page()) {
      await this.getUserName()
    }
  }

  expand() {
    return this.navs().length > 0 || this.search()
  }

  async onLogout() {
    if (this.is_admin_page()) {
      (await this.adminService.logout())
        .pipe(
          catchError(error => {
            this.configService.errorHandler(error)
            throw error
          })
        )
        .subscribe(async () => {
          this.storageService.remove('admin_token')
          await this.router.navigate(['/admin-login'])
        })


    } else {
      (await this.authService.logout())
        .pipe(
          catchError(error => {
            this.configService.errorHandler(error)
            throw error
          })
        )
        .subscribe(async () => {
          this.storageService.remove('token')
          await this.router.navigate(['/'])
        })
    }

  }

  async getUserName() {
    (await this.userService.get_self())
      .pipe(
        catchError(error => {
          if (this.profile_page()){
            this.configService.errorHandler(error)
          }
          throw error
        })
      )
      .subscribe(user => {
        if (this.profile_page()){
          const _user = user as User
          this.userName = _user.first_name + ' ' + _user.last_name
        }
      })
  }

  dropdownToggle() {
    console.log(this.dropdownList)
    this.dropdownList[0].toggle()
  }

  navbarCollapseToggle() {
    if (this.navbarCollapse) {
      this.navbarCollapse.toggle()
    } else {
      const navbarElement = document.querySelector('.navbar-collapse') as HTMLElement
      this.navbarCollapse = new Collapse(navbarElement)
      this.navbarCollapse.toggle()
    }
  }

}
