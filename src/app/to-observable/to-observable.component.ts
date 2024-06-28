import { Component, Injector, inject, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";

@Component({
  selector: 'to-observable',
  templateUrl: './to-observable.component.html',
  styleUrl: './to-observable.component.scss',
  standalone: true
})

export class ToObservableComponent {
  injector = inject(Injector);
  
  onToObservableExample() {
    const numbers = signal(0);
    numbers.set(1);
    numbers.set(2);
    numbers.set(3);
    const numbers$ = toObservable(numbers, {
      injector: this.injector,
    })

    numbers.set(4);
    numbers$.subscribe(
      numbers => console.log('numbers$ ', numbers)
    )
    numbers.set(5); 
    //In console will be numbers$ 5 because A use the effects and they are 
    //calling immediately. Effects wait when the signal become stable and then
    //change detection will be notified vie effects and computed signals 
  }
}