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
  coursesService = inject(CoursesService);

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
      console.log('Beginner courses: ', this.beginnerCourses());
      console.log('Advanced courses: ', this.advancedCourses());
    })
  }
  
  async loadCourses() {
    try {
      const courses = await this.coursesService.loadAllCourses();
      this.#courses.set(courses); //synchronous code
    } catch(err) {
      alert('Error loading courses!');
      console.error(err);
    }
  }
}
