import { Component } from '@angular/core';
import {NavbarComponent} from "../../components/complex/navbar/navbar.component";
import {Nav} from "../../interfaces/ui/nav";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [NavbarComponent],
})
export class HomePage {
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
      name: 'About',
      route: '/about',
      disabled: true
    },
  ]

  constructor() {}
}
