import {Component, input, output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../../services/api/auth/auth.service";

@Component({
  selector: 'app-new-course-form',
  templateUrl: './new-course-form.component.html',
  styleUrls: ['./new-course-form.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule
  ]
})
export class NewCourseFormComponent {
  is_admin = input(false)
  formSubmission = output<FormGroup>();

  validated = false;

  input_col_class = 'col-12'
  // input_col_class = 'col-12 col-sm-6 col-lg-4 col-xxl-3'

  maxLengthRequired = [
    Validators.required,
    Validators.maxLength(255)
  ]

  newCourseForm = new FormGroup({
    name: new FormControl('', this.maxLengthRequired),
    description: new FormControl('', this.maxLengthRequired),
  })

  constructor(
    private authService: AuthService,
  ) { }

  onSubmit() {
    if (this.newCourseForm.invalid) {
      this.bootstrapFormShowValidation()
    }
    else {
      console.log(this.newCourseForm.value)
      this.formSubmission.emit(this.newCourseForm)
    }
  }

  get_error(control_name: string) {
    return this.authService.getFormValidationError(control_name, this.newCourseForm, 'new-course')
  }

  bootstrapFormShowValidation() {
    if (this.validated) return
    this.validated = true;
    const bsForm = document.getElementById('bs-new-course-form')
    bsForm?.classList.add('was-validated')
  }
}
