import {Component, input, output} from '@angular/core';
import {Course} from "../../../interfaces/api/course";
import {Router} from "@angular/router";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FilterDropdownComponent} from "../user-table/filter-dropdown/filter-dropdown.component";

@Component({
  selector: 'app-course-table',
  templateUrl: './course-table.component.html',
  styleUrls: ['./course-table.component.scss'],
  imports: [
    DatePipe,
    FilterDropdownComponent,
    NgForOf,
    NgIf
  ]
})
export class CourseTableComponent {
  courses = input<Course[]>([]);
  headers = [
    {title: 'ID', button_id: 'id'},
    {title: 'Name', button_id: 'name'},
    {title: 'Description', button_id: 'description'},
    {title: 'Created at', button_id: 'created_at'},
    {title: 'Deleted', button_id: 'deleted_at'},
    {title: '', button_id: ''},
  ]
  delete = output<number>();

  constructor(
    private router: Router
  ) { }

  sort({column, direction}: {column:string, direction:number}){
    this.courses().sort((a, b) => {
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

  async openCourse(course: Course) {
    console.log(course)
    await this.router.navigate(['/admin-course-details', course.id])
  }

  onDelete(id: number) {
    this.delete.emit(id)
  }

}
