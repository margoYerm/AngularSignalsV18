import {Component, linkedSignal, signal} from "@angular/core";

@Component({
  selector: 'linked-signal-demo',
  templateUrl: './linked-signal.component.html',
  styleUrl: "./linked-signal.component.scss"
})
export class LinkedSignalDemoComponent {
  courses = [
    {
      code: "BEGINNERS",
      title: "Angular for Beginners",
      defaultQuantity: 10
    },
    {
      code: "SIGNALS",
      title: "Angular Signals In Depth",
      defaultQuantity: 20
    },
    {
      code: "SSR",
      title: "Angular SSR In Depth",
      defaultQuantity: 30
    }
  ];
  
  //writable signal
  selectedCourse = signal<string | null>("BEGINNERS");

  //should be derived value calculated from the selected course
  //quantity = signal(1);
  quantity = linkedSignal({
    //trigger signal, which change a value. One or more signals can be listening
    //source: this.selectedCourse, //one source signal syntax
    //for few sources 
    source: () => ({courseCode: this.selectedCourse,}),    
    
    //this return a new value og the linkedSignal
    computation: (source, previous) => {
      console.log(`linkedSignal source: `, source.courseCode());
      console.log(`linkedSignal previous: `, previous);
      return this.courses
        .find(c => c.code === source.courseCode())?.defaultQuantity ?? 1
    }
  })

  constructor() {}  

  onQuantityChanged(quantity: string) {
    this.quantity.set(parseInt(quantity));    
  }

  onArticleAdded() {
    alert(`${this.quantity()} licenses added for ${this.selectedCourse()}`);
  }

  onCourseSelected(courseCode: string) {
    this.selectedCourse.set(courseCode);
  }
}