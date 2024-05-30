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
  courses = signal<Course[]>([]);
  coursesService = inject(CoursesServiceWithFetch);

  constructor() { 
    this.loadCourses() //we can finish with this row, without .then()
      .then(() => console.log('All courses loaded: ', this.courses()))
  }

  /*First method
  loadCourses() {
    this.coursesService.loadAllCourses()
      //because this method return a Promise we should add next
      .then(courses => this.courses.set(courses))
      //add handling error if you want, but we will see another way to do this
      .catch(err => {console.log(err)})
  }*/

  //Second (better) method
  //if try/catch applied to the promise catch will catch error for synchronous 
  //code and for Promise  
  async loadCourses() {
    try {
      const courses = await this.coursesService.loadAllCourses(); //Promise
      this.courses.set(courses); //synchronous code
    } catch(err) {
      alert('Error loading courses!');
      console.error(err);
    }
    
  } 

}
