import {Component, input, OnInit} from '@angular/core';
import {User} from "../../../interfaces/api/user";

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent  implements OnInit {
  value = input<User[]>([]);

  constructor() { }

  ngOnInit() {}

}
