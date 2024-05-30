import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Course} from "../models/course.model";


@Injectable({
  providedIn: "root"
})

export class CoursesServiceWithFetch {
  //This is not good place for handling errors, let them bubble up and 
  //handling them in another place because of this service will be used 
  //by many components

  env = environment; 
  //before loadAllCourses(): Observable<Course[]>
  async loadAllCourses(): Promise<Course[]> {
    const response = await fetch(`${this.env.apiRoot}/courses`);
    const payload = await response.json();
    return payload.courses;
  }

  /*Another way with return type, first way is better
  async loadAllCourses() {
    const response = await fetch(`${this.env.apiRoot}/courses`);
    const payload = await response.json();
    return payload.courses as Courses[];
  }*/
  

}
