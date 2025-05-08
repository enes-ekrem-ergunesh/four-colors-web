import {Component, input, OnInit, output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../../services/api/auth/auth.service";
import {Course} from "../../../interfaces/api/course";
import {CourseService} from "../../../services/api/course/course.service";
import {catchError} from "rxjs";
import {ConfigService} from "../../../services/config/config.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-new-classroom-form',
  templateUrl: './new-classroom-form.component.html',
  styleUrls: ['./new-classroom-form.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgForOf
  ]
})
export class NewClassroomFormComponent implements OnInit{
  is_admin = input(false)
  formSubmission = output<FormGroup>();
  courses: Course[] = []

  validated = false;

  input_col_class = 'col-12'
  // input_col_class = 'col-12 col-sm-6 col-lg-4 col-xxl-3'

  maxLengthRequired = [
    Validators.required,
    Validators.maxLength(255)
  ]

  naturalNumberRequires = [
    Validators.required,
    Validators.min(1),
    Validators.pattern(/^[1-9]\d*$/)
  ]

  newClassroomForm = new FormGroup({
    course_id: new FormControl('0', this.naturalNumberRequires),
    name: new FormControl('', this.maxLengthRequired),
    number_of_sessions: new FormControl('', this.naturalNumberRequires),
    expected_session_duration: new FormControl('40', this.naturalNumberRequires),
  })

  constructor(
    private authService: AuthService,
    private courseService: CourseService,
    private configService: ConfigService,
  ) { }

  async ngOnInit() {
    (await this.courseService.get_courses())
      .pipe(
        catchError(error => {
          this.configService.errorHandler(error, true)
          throw error
        })
      )
      .subscribe(res => {
        this.courses = res as Course[]
    })
  }

  onSubmit() {
    if (this.newClassroomForm.invalid) {
      this.bootstrapFormShowValidation()
    }
    else {
      console.log(this.newClassroomForm.value)
      this.formSubmission.emit(this.newClassroomForm)
    }
  }

  get_error(control_name: string) {
    return this.authService.getFormValidationError(control_name, this.newClassroomForm, 'new-classroom')
  }

  bootstrapFormShowValidation() {
    if (this.validated) return
    this.validated = true;
    const bsForm = document.getElementById('bs-new-classroom-form')
    bsForm?.classList.add('was-validated')
  }
}
