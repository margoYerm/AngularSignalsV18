import {Component, ElementRef, inject, signal, viewChild} from '@angular/core';
import {LessonsService} from "../services/lessons.service";
import {Lesson} from "../models/lesson.model";
import {LessonDetailComponent} from "./lesson-detail/lesson-detail.component";

@Component({
  selector: 'lessons',
  standalone: true,
  imports: [
    LessonDetailComponent
  ],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss'
})
export class LessonsComponent {
  //we will show to the user one of them
  mode = signal<'master' | 'detail'>('master');
  
  lessons = signal<Lesson[]>([]); //result of our search

  //witch lesson was clicked to show detail
  selectedLesson = signal<Lesson | null>(null);

  lessonsService = inject(LessonsService);

  //second and better way get a value from the input
  //required needs to handle error in case when no match not found  
  searchInput = viewChild.required<ElementRef>('search'); 

  //onSearch(inputValue: string) {} //First way of get a value from the input
  onSearch() {
    //grab value from the signal query
    const query = this.searchInput()?.nativeElement.value;
    //This value will be logged after push enter or click on btn
    console.log('Input query', query);
  }
}
