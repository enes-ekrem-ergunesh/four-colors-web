import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NavbarComponent} from "../../../components/complex/navbar/navbar.component";
import {Nav} from "../../../interfaces/ui/nav";
import {CommonTsService} from "../../../services/common-ts/common-ts.service";

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.page.html',
  styleUrls: ['./admin-home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class AdminHomePage implements OnInit {
  navs!: Nav[]

  constructor(
    common_ts: CommonTsService,
  ) {
    this.navs = common_ts.admin_navs
  }

  async ngOnInit() {
    return
  }

}
