import { Component, OnInit } from '@angular/core';
import {
  UserDetailsHeaderComponent
} from "../../../../components/complex/user-details-header/user-details-header.component";

@Component({
  selector: 'app-admin-student-details',
  templateUrl: './admin-student-details.component.html',
  styleUrls: ['./admin-student-details.component.scss'],
  imports: [
    UserDetailsHeaderComponent
  ],
  standalone: true
})
export class AdminStudentDetailsComponent  implements OnInit {


  constructor() { }

  ngOnInit() {
    return
  }

}
