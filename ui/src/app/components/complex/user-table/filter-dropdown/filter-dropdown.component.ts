import {Component, input, OnInit, output} from '@angular/core';
import {Dropdown} from "bootstrap";

@Component({
  selector: 'app-filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.scss'],
  standalone: true,
})
export class FilterDropdownComponent  implements OnInit {
  button_id = input('')
  sort = output<{column:string, direction:number}>();

  constructor() { }

  ngOnInit() {
    return
  }

  toggle() {
    let temp = new Dropdown(document.getElementById(this.button_id()) as HTMLInputElement);
    temp.toggle()
  }

}
