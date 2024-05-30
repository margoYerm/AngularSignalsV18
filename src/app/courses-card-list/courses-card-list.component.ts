import {Component, inject, input, output} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Course} from "../models/course.model";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'courses-card-list',
  standalone: true,
  imports: [
    RouterLink,    
  ],
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.scss'
})
export class CoursesCardListComponent {
  //this is required Signal input
  //if we not make this signal required, we need pass initial value []
  //we also can pass option values like alias (for name), or transform fn 
  courses = input.required<Course[]>()
}
