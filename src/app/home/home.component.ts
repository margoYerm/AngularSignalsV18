import {afterNextRender, Component, computed, effect, EffectRef, ElementRef, inject, INJECTOR, Injector, Signal, signal, viewChild} from '@angular/core';
import {CoursesService} from "../services/courses.service";
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../messages/messages.service";
import {catchError, from, interval, startWith, throwError} from "rxjs";
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop";
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { LoadingService } from '../loading/loading.service';
import {MatTooltip, MatTooltipModule} from '@angular/material/tooltip';

type Counter = {
  value: number;
}
@Component({
  selector: 'home',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    CoursesCardListComponent,
    MatTooltipModule,
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

  //loading indicator
  loadingService = inject(LoadingService);

  //messages component with own service, alert
  messagesService = inject(MessagesService);

  beginnerCourses = computed(() => {
    return this.#courses().filter(course => course.category === 'BEGINNER');
  })

  advancedCourses = computed(() => {
    return this.#courses().filter(course => course.category === 'ADVANCED');
  })  

  //get an instance of the coursesCardList. With type it can't return undefined
  beginnersList = viewChild<CoursesCardListComponent>('beginnersList'); 
  //get an element ref.
  beginnersListRef = viewChild('beginnersList', {
    //read: ElementRef //show element
    read: MatTooltip //logging tooltip
  }); 

  beginnersListCheck = viewChild('beginnersList', {    
    read: CoursesCardListComponent //logging tooltip
  });

  //to convert signal to Observable, demo for lesson RxJs Interoperability
  courses$ = toObservable(this.#courses);

  constructor() {
    //using demo for lesson RxJs Interoperability
    this.courses$.subscribe(
      courses => console.log('Courses$', courses)
    )

    this.loadCourses() //we can finish with this row, without .then()
      //.then(() => console.log('All courses loaded: ', this.#courses()))

    //this effect for demo viewChild signal component
      effect(() => {
        //console.log('Beginners list', this.beginnersList());
        //console.log('Beginners listCheck', this.beginnersListCheck());
        //console.log('Beginners element', this.beginnersListRef());
    })

    effect(() => {
      //console.log('Beginner courses: ', this.beginnerCourses());
      //console.log('Advanced courses: ', this.advancedCourses());
    })
  }
  
  async loadCourses() {
    try {
      //we will add loading indicator to the service
      //this.loadingService.loadingOn(); 
      const courses = await this.coursesService.loadAllCourses();
      //sortCoursesBySeqNo defined in models/course.module.ts
      this.#courses.set(courses.sort(sortCoursesBySeqNo)); //synchronous code

    } catch(err) {
      //it's useful to different user messages ( "error" | "warning" | "info" | "success";)
      this.messagesService.showMessage('Error loading courses!', 'error');
      //alert('Error loading courses!'); //old way to error handling
      console.error(err);
    } /*finally { //will be turnedOff if success or error
      this.loadingService.loadingOff();
    }*/
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
      this.messagesService.showMessage('Error deleting course.', 'error');      
    }    
  }

  async onAddCourse() {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'create',
      title: 'Create New Course',
    })
    if(!newCourse) {return}
    //for signals always return new array, don't modify existing signal!!!!!!
    const newCourses = [
      ...this.#courses(),
      newCourse
    ];
    this.#courses.set(newCourses);
  }


  //example for toSignal() Configuration options - requireSync and initialValue
  //(name of lesson in the Signals course)  
  injector = inject(Injector);
  onToSignalExample() {     
    const number$ = interval(1000)//Observable with asynchronous values
    .pipe(startWith(0)) //to avoid error from requireSync: true
    const numbers = toSignal(number$, {//converting Observable to a signal
      injector: this.injector, 
       //without initialValue in this case we get: undefined 1 2 3 4..... 
      //initialValue: 0, //to have initial value in the signal

      requireSync: true // for trow error if stream don't has initial value
    })
    effect(() => {
      //first value is undefined, because it don't have initial value,
      //so we will pass it initialValue: 0
      console.log('Numbers: ', numbers() )
    }, {
      injector: this.injector
    }) 
  }

  //toSignal example at the end of the course
  //we using here injector = inject(Injector);
  //we get data from the server   
  coursesToSignal$ = from(this.coursesService.loadAllCourses()) //from return Promis
  onToSignalExample2() {
    const courses = toSignal(this.coursesToSignal$, {
      injector: this.injector, //we pass it when we use it like click handler
    });

    effect(() => {
      console.log('ToSignal courses$, example2', courses());
    }, {
      injector: this.injector
    })
  }

  onToSignalError() {   
    try {
      const courses$ = from(this.coursesService.loadAllCourses())
        .pipe(
          catchError((err) => {
            console.log('Error caught in the catchError', err)
            throw err
          })
        )   
      const courses = toSignal(courses$, {//converting Observable to a signal
        injector: this.injector, 
        rejectErrors: true, //handling error always in catchError and never in catch            
      })
      effect(() => {
        //first value is undefined, because it don't have initial value,
        //here always be last emitted value by the Observable (in our case - undefined)
        console.log('toSignal errors', courses() ) 
      }, {
        injector: this.injector
      }) 
    } catch (err) { 
      console.log('Error caught in the catch', err)
    }
  }


  //Lesson RxJs Interoperability with toObservable in handler fn
  injector2 = inject(Injector);
  onToObservable() {
    const courses2$ = toObservable(this.#courses, {
      injector: this.injector2,
    });
    courses2$.subscribe(
      courses => console.log('Courses2$: ', courses)
    )
  } //error without passing {injector: injector2}
}
