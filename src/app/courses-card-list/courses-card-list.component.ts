import {Component, ElementRef, effect, inject, input, output, signal, viewChildren} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Course} from "../models/course.model";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { EditCourseDialogData } from '../edit-course-dialog/edit-course-dialog.data.model';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'courses-card-list',
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

  //output for parent, that this course was deleted
  courseDeleted = output<string>();
  
  dialog = inject(MatDialog);  

  //Lesson ViewChildren signal query
  coursesCards = viewChildren<ElementRef>('courseCard');

  constructor() {
    effect(() => {
      //we get 2 collections of elements (beginner and advanced) 
      //console.log('CoursesCards: ', this.coursesCards());
    })
  }

  async onEditCourse(course: Course) {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'update',
      title: 'Update existing course',
      course
    })
    if(!newCourse) {return};
    console.log('Course was edited', newCourse);
    this.courseUpdated.emit(newCourse);
  }

  onCourseDeleted(course: Course) {
    this.courseDeleted.emit(course.id);
  }
}
