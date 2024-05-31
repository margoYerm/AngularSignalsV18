import {Injectable, inject} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../environments/environment";
import {firstValueFrom} from "rxjs";
import {Course} from "../models/course.model";
import {GetCoursesResponse} from "../models/get-courses.response";


@Injectable({
  providedIn: "root"
})
export class CoursesService {
  env = environment;
  envCourses = `${this.env.apiRoot}/courses`;
  http = inject(HttpClient);

  //before loadAllCourses(): Observable<Course[]>
  async loadAllCourses(): Promise<Course[]> {
    //here we get an Observable, it's not updated yet.
    const courses$ = 
      this.http.get<GetCoursesResponse>(this.envCourses);
    //converting Observable to a Promise, firstValueFrom is a method from RxJs
    const response = await firstValueFrom(courses$);
    return response.courses;
  }

  //Partial type (Make all properties in T optional) because we don't have id yet. 
  async createCourse (course: Partial<Course>): Promise<Course> {
    const course$ = this.http.post<Course>(this.envCourses, course);
    return firstValueFrom(course$); //Obs to Promise
  }

  async saveCourse(courseId: string, changes: Partial<Course>): Promise<Course> {
    const course$ = this.http.put<Course>(`this.envCourses/${courseId}`, changes);
    return firstValueFrom(course$); //Obs to Promise
  }

  async deleteCourse (courseId: string) {
    const delete$ = this.http.delete(`this.envCourses/${courseId}`);
    return firstValueFrom(delete$);
  }
}
