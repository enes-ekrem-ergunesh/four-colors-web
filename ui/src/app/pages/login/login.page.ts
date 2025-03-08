import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NavbarComponent} from "../../components/complex/navbar/navbar.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class LoginPage implements OnInit {

  constructor() { }

  ngOnInit() {
    return
  }

}
