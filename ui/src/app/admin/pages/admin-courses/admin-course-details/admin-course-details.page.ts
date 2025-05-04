import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-admin-course-details',
  templateUrl: './admin-course-details.page.html',
  styleUrls: ['./admin-course-details.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AdminCourseDetailsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
