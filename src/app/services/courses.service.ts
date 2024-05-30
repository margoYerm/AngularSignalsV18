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
  http = inject(HttpClient);

  //before loadAllCourses(): Observable<Course[]>
  async loadAllCourses(): Promise<Course[]> {
    //here we get an Observable, it's not updated yet.
    const courses$ = 
      this.http.get<GetCoursesResponse>(`${this.env.apiRoot}/courses`);
    //converting Observable to a Promise, method from RxJs
    const response = await firstValueFrom(courses$);
    return response.courses;
  }
}
