import {afterNextRender, Component, computed, effect, EffectRef, inject, Injector, signal} from '@angular/core';
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
  counterSignal = signal(0);
  readOnlySignal = signal(5).asReadonly(); //read only signal
  counterSObj = signal<Counter>({ //generic parameter of signal
    value: 100
  });
  arrSignals = signal<number[]>([1, 2, 3]);  
  effectRef: EffectRef | null = null;

  constructor() {
    //for method cleanup effect
    /*this.effectRef = effect(() => {
      //will be called in startup time with initial value
      console.log(`Counter value: ${this.counterSignal}`);      
    })*/

    //callback onCleanup for clean timeout
    this.effectRef = effect((onCleanup) => {  
      const counter = this.counterSignal();    
      const timeout = setTimeout(() => {
        console.log(`Counter value: ${counter}`);
      }, 1000)  
      //will be called when the effect gets destroyed but also before
      //the next execution og the effect
      onCleanup(() => {
        console.log('Calling cleanup');
        clearTimeout(timeout);
      })   
    })
  }  

  //after calling this method logging not will be executed (from effect)
  cleanup() {
    this.effectRef?.destroy(); 
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
