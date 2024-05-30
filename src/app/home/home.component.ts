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
  coursesService = inject(CoursesService);

  constructor() { 
    this.loadCourses() //we can finish with this row, without .then()
      .then(() => console.log('All courses loaded: ', this.courses()))
  }

  
  async loadCourses() {
    try {
      const courses = await this.coursesService.loadAllCourses(); 
      this.courses.set(courses); //synchronous code
    } catch(err) {
      alert('Error loading courses!');
      console.error(err);
    }
    
  } 

}
