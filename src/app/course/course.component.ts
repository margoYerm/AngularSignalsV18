import { Component, OnInit, inject, signal } from "@angular/core";
import { Course } from "../models/course.model";
import { Lesson } from "../models/lesson.model";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
  standalone: true,
  imports: [],
}) 
 
export class CourseComponent implements OnInit {
  course = signal<Course | null>(null);
  lessons = signal<Lesson[]>([]);

  //for get the data from the courses.resolver
  route = inject(ActivatedRoute);

  ngOnInit() {
    //getting data from the courses resolver
    this.course.set(this.route.snapshot.data["course"]);
   
    //getting data from the lessons resolver
    this.lessons.set(this.route.snapshot.data["lessons"]);
    console.log('Lessons in course', this.lessons())
  }
}