import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormGroup, FormsModule} from '@angular/forms';
import {NavbarComponent} from "../../components/complex/navbar/navbar.component";
import {LoginFormComponent} from "../../components/form/login-form/login-form.component";
import {Login} from "../../interfaces/api/login";
import {AuthService} from "../../services/api/auth/auth.service";
import {Token} from "../../interfaces/api/token";
import {StorageService} from "../../services/storage/storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, LoginFormComponent]
})
export class LoginPage implements OnInit {

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
  ) { }

  ngOnInit() {
    return
  }

  onLoginFormSubmit(form_data: FormGroup){
    const login_data = form_data.value as Login
    this.authService.login(login_data).subscribe(async value => {
      const token = value as Token
      await this.storageService.set('token', token.token)
      await this.router.navigate(['/home'])
    })
  }

}
