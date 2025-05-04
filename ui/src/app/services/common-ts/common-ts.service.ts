import { Injectable } from '@angular/core';
import {Nav} from "../../interfaces/ui/nav";

@Injectable({
  providedIn: 'root'
})
export class CommonTsService {
  admin_navs: Nav[] = [
    {
      name: 'Dashboard',
      route: '/admin-home',
    },
    {
      name: 'Teachers',
      route: '/admin-teachers',
    },
    {
      name: 'Students',
      route: '/admin-students',
    },
    {
      name: 'Courses',
      route: '/admin-courses',
    },
  ]

  constructor() { }
}
