import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormGroup, FormsModule} from '@angular/forms';
import {LoginFormComponent} from "../../../components/form/login-form/login-form.component";
import {NavbarComponent} from "../../../components/complex/navbar/navbar.component";
import {AdminLogin} from "../../interfaces/admin-login";
import {AdminService} from "../../../services/api/admin/admin.service";
import {Token} from "../../../interfaces/api/token";
import {Router} from "@angular/router";
import {StorageService} from "../../../services/storage/storage.service";
import {ConfigService} from "../../../services/config/config.service";

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.page.html',
  styleUrls: ['./admin-login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, LoginFormComponent]
})
export class AdminLoginPage implements OnInit {

  constructor(
    private adminService: AdminService,
    private storageService: StorageService,
    private router: Router,
    private configService: ConfigService,
  ) { }

  async ngOnInit() {
    let token = await this.storageService.get('token')
    console.log('token: ', token);
  }

  onLoginFormSubmit(form_data: FormGroup) {
    const login_data = form_data.value as AdminLogin
    this.adminService.login(login_data).subscribe(async value => {
      const token = value as Token
      await this.storageService.set('admin_token', token.token)
      await this.router.navigate(['/admin-home'])
    })
  }

}
