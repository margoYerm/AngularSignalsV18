import {afterNextRender, Component, computed, effect, EffectRef, inject, Injector, Signal, signal} from '@angular/core';
import {CoursesService} from "../services/courses.service";
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../messages/messages.service";
import {catchError, from, throwError} from "rxjs";
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop";
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';

type Counter = {
  value: number;
}
@Component({
  selector: 'home',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    CoursesCardListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
  //we use signals for Angular knows when data was changed
  //# makes signal private
  #courses = signal<Course[]>([]);
  //coursesService = inject(CoursesServiceWithFetch);
  coursesService = inject(CoursesService);

  dialog = inject(MatDialog);  // for onAddCourse() fn

  beginnerCourses = computed(() => {
    return this.#courses().filter(course => course.category === 'BEGINNER');
  })

  advancedCourses = computed(() => {
    return this.#courses().filter(course => course.category === 'ADVANCED');
  })  

  constructor() {
    this.loadCourses() //we can finish with this row, without .then()
      .then(() => console.log('All courses loaded: ', this.#courses()))

    effect(() => {
      //console.log('Beginner courses: ', this.beginnerCourses());
      //console.log('Advanced courses: ', this.advancedCourses());
    })
  }
  
  async loadCourses() {
    try {
      const courses = await this.coursesService.loadAllCourses();
      //sortCoursesBySeqNo defined in models/course.module.ts
      this.#courses.set(courses.sort(sortCoursesBySeqNo)); //synchronous code
    } catch(err) {
      alert('Error loading courses!');
      console.error(err);
    }
  }

  //method for update list of courses if course was updated or new course 
  //was created
  onCourseUpdated(updatedCourse: Course) {
    const courses = this.#courses(); //value of the Signal
    const newCourses = courses.map(course => (
      course.id === updatedCourse.id ? updatedCourse : course
    ));
    this.#courses.set(newCourses);
  }

  async onCourseDeleted(courseId: string) {
    try {
      await this.coursesService.deleteCourse(courseId);
      //logic for update signal
      const courses = this.#courses(); //value of the Signal
      const newCourses = courses.filter(
        course => course.id !== courseId
      );
      this.#courses.set(newCourses);
    } catch (err) {
      console.error(err);
      alert('Error deleting course.');
    }    
  }

  async onAddCourse() {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'create',
      title: 'Create New Course',
    })
    //for signals always return new array, don't modify existing signal!!!!!!
    const newCourses = [
      ...this.#courses(),
      newCourse
    ];
    this.#courses.set(newCourses);
  }
}
