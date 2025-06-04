import {Component, input, OnInit, output} from '@angular/core';
import {addIcons} from "ionicons";
import {eye, eyeOff} from "ionicons/icons";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../../services/api/auth/auth.service";
import {IonIcon} from "@ionic/angular/standalone";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    IonIcon,
    NgIf
  ],
  standalone: true
})
export class LoginFormComponent  implements OnInit {
  is_admin = input(false)
  formSubmission = output<FormGroup>();

  showHidePasswordIcon = 'eye';
  passwordInputType = 'password';
  validated = false;

  emailValidators = [
    Validators.required,
    Validators.email
  ]

  loginForm = new FormGroup({
    email: new FormControl('', this.emailValidators),
    password: new FormControl('', Validators.required),
    remember_me: new FormControl(false)
  })

  constructor(
    private authService: AuthService,
  ) {
    addIcons({eye, eyeOff})
  }

  ngOnInit() {
    return
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.bootstrapFormShowValidation()
    }
    else {
      this.formSubmission.emit(this.loginForm)
    }
  }

  get_error(control_name: string) {
    return this.authService.getFormValidationError(control_name, this.loginForm, 'login')
  }

  showHidePassword() {
    this.passwordInputType = this.passwordInputType === 'password' ? 'text' : 'password';
    this.showHidePasswordIcon = this.showHidePasswordIcon === 'eye' ? 'eye-off' : 'eye';
  }

  showHidePasswordButtonStyle() {
    // let element = document.getElementById('show-hide-password-button')
    let element = document.getElementsByClassName('show-hide-password-button')[0] as HTMLElement
    if (element) {
      setTimeout(() => {
        element.style['display'] = this.loginForm.get('password')?.value ? 'block' : 'none'
        element.style['marginBottom'] = this.authService.isPasswordErrorDisplayed() ? '19px' : '0'
      }, 20)
    }

    return "display: " + (this.loginForm.get('password')?.value ? 'block' : 'none') +
      "; margin-bottom: " + (this.authService.isPasswordErrorDisplayed() ? '15px' : '0')
  }

  bootstrapFormShowValidation() {
    if (this.validated) return
    this.validated = true;
    const bsForm = document.getElementById('bs-login-form')
    bsForm?.classList.add('was-validated')

    // add a gap on the right of the show-hide-password button
    let element = document.getElementsByClassName('show-hide-password-button')[0] as HTMLElement
    const cssObj = window.getComputedStyle(element, null);
    const right = cssObj.getPropertyValue('right')
    element.style['right'] = (parseInt(right) + 17) + 'px'
  }

}
