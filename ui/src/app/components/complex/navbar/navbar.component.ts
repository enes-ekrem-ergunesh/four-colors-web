import {Component, input, OnInit} from '@angular/core';
import {Nav} from "../../../interfaces/ui/nav";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";

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
export class NavbarComponent  implements OnInit {
  navs = input<Nav[]>([{
    name: 'Home',
    route: '/home'
  }])
  active_nav = input<number>(0)
  search = input<boolean>(false)

  constructor() { }

  ngOnInit() {
    return
  }

}
