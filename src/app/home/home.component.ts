import {Component, computed, effect, inject, Injector, signal} from '@angular/core';
import {CoursesService} from "../services/courses.service";
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../messages/messages.service";
import {catchError, from, throwError} from "rxjs";
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop";

type Counter = {
  value: number;
}
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
  counterSObj = signal<Counter>({ //generic parameter of signal
    value: 100
  });
  arrSignals = signal<number[]>([1, 2, 3]);

  constructor() {
    effect(() => {
      //will be called in startup tile with initial value
      console.log(`Counter value: ${this.counterSignal}`)
    }) //Counter value: [Signal: num]
  }

  tenXCounter = computed(() => {
    const val = this.counterSignal();
    //computed signal always has to return a value
    return val * 10;
  })

  //computed signal that depends of another computed signal
  hundredXCounter = computed(() => {
    const val = this.tenXCounter();    
    return val * 10;
  })

 

  incrementSignal() {
    //this.counterSignal.set(this.counterSignal()+1);
    
    //here we take current value and adding 1 to this current value
    //use this for demo texXCounter
    this.counterSignal.update((counter) => counter +1);    

    //here is correct way of mutation signal object property
    /*this.counterSObj.update(counterSO => 
      ({
        ...counterSObj,
        value: counterSObj.value +1
      })
    )*/
  }

  append() {
    this.arrSignals.update((values) => ([
      ...values,
      values[values.length - 1] + 1
    ]))
  }

}
