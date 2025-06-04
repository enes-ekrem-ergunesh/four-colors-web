import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NavbarComponent} from "../../components/complex/navbar/navbar.component";
import {Nav} from "../../interfaces/ui/nav";

@Component({
  selector: 'app-my',
  templateUrl: './my.page.html',
  styleUrls: ['./my.page.scss'],
  standalone: true,
    imports: [CommonModule, FormsModule, NavbarComponent]
})
export class MyPage implements OnInit {
  navs: Nav[] = [
    {
      name: 'Dashboard',
      route: '/my',
    },
    {
      name: 'My Courses',
      route: '/my-courses',
    },
  ]

  constructor() { }

  ngOnInit() {
    return
  }

}
