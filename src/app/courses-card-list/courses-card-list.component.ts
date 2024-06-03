import {Component, inject, input, output} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Course} from "../models/course.model";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { EditCourseDialogData } from '../edit-course-dialog/edit-course-dialog.data.model';
import { FormBuilder } from '@angular/forms';

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
  courses = input.required<Course[]>();

  //output for parent component, that new data is available
  courseUpdated = output<Course>();
  
  dialog = inject(MatDialog);  

  async onEditCourse(course: Course) {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'update',
      title: 'Update existing course',
      course
    })
    console.log('Course was edited', newCourse);
    this.courseUpdated.emit(newCourse);
  }

}
