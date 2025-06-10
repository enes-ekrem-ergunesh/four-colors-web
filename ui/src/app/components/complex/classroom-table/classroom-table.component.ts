import {Component, input, OnInit, output} from '@angular/core';
import {Router} from "@angular/router";
import {Classroom} from "../../../interfaces/api/classroom";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FilterDropdownComponent} from "../user-table/filter-dropdown/filter-dropdown.component";
import {Course} from "../../../interfaces/api/course";
import {catchError} from "rxjs";
import {CourseService} from "../../../services/api/course/course.service";
import {ConfigService} from "../../../services/config/config.service";

@Component({
  selector: 'app-classroom-table',
  templateUrl: './classroom-table.component.html',
  styleUrls: ['./classroom-table.component.scss'],
  imports: [
    DatePipe,
    FilterDropdownComponent,
    NgForOf,
    NgIf
  ]
})
export class ClassroomTableComponent implements OnInit{
  classrooms = input<Classroom[]>([]);
  headers = [
    {title: 'ID', button_id: 'id'},
    {title: 'Course', button_id: 'course_id'},
    {title: 'Name', button_id: 'name'},
    {title: 'Sessions', button_id: 'number_of_sessions'},
    {title: 'Session Duration', button_id: 'expected_session_duration'},
    {title: 'Created at', button_id: 'created_at'},
    {title: 'Deleted', button_id: 'deleted_at'},
    {title: '', button_id: ''},
  ]
  courses: Course[] = []
  delete = output<number>();

  constructor(
    private router: Router,
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

  getCourseById(id: number) {
    return this.courses.find(course => course.id === id)
  }

  sort({column, direction}: {column:string, direction:number}){
    console.log(`sorting by ${column} in direction ${direction}`)
    this.classrooms().sort((a, b) => {
      const valueA = (a as any)[column];
      const valueB = (b as any)[column];

      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return -1 * direction;
      if (valueB == null) return direction;

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB) * direction;
      }
      if (valueA > valueB) return direction;
      if (valueA < valueB) return -1 * direction;
      return 0;
    })
  }

  async openClassroom(classroom: Classroom) {
    console.log(classroom)
    await this.router.navigate(['/admin-classroom-details', classroom.id])
  }

  onDelete(id: number) {
    this.delete.emit(id)
  }

  protected readonly console = console;
}
