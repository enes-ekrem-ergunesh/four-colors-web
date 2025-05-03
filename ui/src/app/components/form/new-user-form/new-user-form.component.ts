import {Component, input, OnInit, output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Country} from "../../../interfaces/api/country";
import {AuthService} from "../../../services/api/auth/auth.service";
import {NationalityService} from "../../../services/api/nationality/nationality.service";
import {ConfigService} from "../../../services/config/config.service";
import {addIcons} from "ionicons";
import {eye, eyeOff} from "ionicons/icons";
import {catchError} from "rxjs";
import {IonIcon} from "@ionic/angular/standalone";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-new-user-form',
  templateUrl: './new-user-form.component.html',
  styleUrls: ['./new-user-form.component.scss'],
  imports: [
    IonIcon,
    NgForOf,
    ReactiveFormsModule
  ]
})
export class NewUserFormComponent  implements OnInit {
  is_admin = input(false)
  formSubmission = output<FormGroup>();

  countries:Country[] = []
  showHidePasswordIcon = 'eye';
  passwordInputType = 'password';
  validated = false;

  input_col_class = 'col-12 col-sm-6 col-lg-4 col-xxl-3'

  emailValidators = [
    Validators.required,
    Validators.maxLength(255),
    Validators.email
  ]

  passwordValidators = [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
  ]

  maxLengthRequired = [
    Validators.required,
    Validators.maxLength(255)
  ]

  newUserForm = new FormGroup({
    email: new FormControl('', this.emailValidators),
    password: new FormControl('', this.passwordValidators),
    first_name: new FormControl('', this.maxLengthRequired),
    last_name: new FormControl('', this.maxLengthRequired),
    nationality: new FormControl(1),
    birthdate: new FormControl(''),
    gender: new FormControl('select'),
  })


  constructor(
    private authService: AuthService,
    private nationalityService: NationalityService,
    private configService: ConfigService
  ) {
    addIcons({eye, eyeOff})
  }

  ngOnInit() {
    this.nationalityService.getAllCountries()
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe(countries => {
        this.countries = countries as Country[]
        // filter if name === null
        this.countries = this.countries.filter(country => country.name !== null)
        // sort the countries by name
        this.countries.sort((a, b) => {
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
          return 0
        })
      })
  }

  onSubmit() {
    if (this.newUserForm.invalid) {
      this.bootstrapFormShowValidation()
    }
    else {
      console.log(this.newUserForm.value)
      this.formSubmission.emit(this.newUserForm)
    }
  }

  get_error(control_name: string) {
    return this.authService.getFormValidationError(control_name, this.newUserForm)
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
        element.style['display'] = this.newUserForm.get('password')?.value ? 'block' : 'none'
        element.style['marginBottom'] = this.authService.isPasswordErrorDisplayed() ? '19px' : '0'
      }, 20)
    }

    return "display: " + (this.newUserForm.get('password')?.value ? 'block' : 'none') +
      "; margin-bottom: " + (this.authService.isPasswordErrorDisplayed() ? '15px' : '0')
  }

  bootstrapFormShowValidation() {
    if (this.validated) return
    this.validated = true;
    const bsForm = document.getElementById('bs-new-user-form')
    bsForm?.classList.add('was-validated')

    // add a gap on the right of the show-hide-password button
    let element = document.getElementsByClassName('show-hide-password-button')[0] as HTMLElement
    const cssObj = window.getComputedStyle(element, null);
    const right = cssObj.getPropertyValue('right')
    element.style['right'] = (parseInt(right) + 17) + 'px'
  }

}
