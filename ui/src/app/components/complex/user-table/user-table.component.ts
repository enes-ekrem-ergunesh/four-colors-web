import {Component, input, OnInit} from '@angular/core';
import {User} from "../../../interfaces/api/user";
import {DatePipe, NgForOf} from "@angular/common";
import {FilterDropdownComponent} from "./filter-dropdown/filter-dropdown.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
  imports: [
    NgForOf,
    DatePipe,
    FilterDropdownComponent,
  ]
})
export class UserTableComponent  implements OnInit {
  users = input<User[]>([]);

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    return
  }

  sort({column, direction}: {column:string, direction:number}){
    console.log(`sorting by ${column} in direction ${direction}`)
    this.users().sort((a, b) => {
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

  async openUser(user: User) {
    console.log(user)
    await this.router.navigate(['/admin-user-details', user.id])
  }

}
