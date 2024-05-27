import {Component, computed, effect, inject, Injector, signal} from '@angular/core';
import {CoursesService} from "../services/courses.service";
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../messages/messages.service";
import {catchError, from, throwError} from "rxjs";
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop";

@Component({
  selector: 'home',
  standalone: true,
  //signals: true, //'signals' does not exist in type 'Component'.
  imports: [
    MatTabGroup,
    MatTab,
    CoursesCardListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  //counter = 0;
  counterSignal = signal(0);
  readOnlySignal = signal(5).asReadonly(); //read only signal


  /*increment() {
    this.counter++;
  }*/

  incrementSignal() {
    //this.counterSignal.set(this.counterSignal()+1);
    
    //here we take current value and adding 1 to this current value
    this.counterSignal.update((counter) => counter +1);
  }

}
