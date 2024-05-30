import {Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../environments/environment";
import {firstValueFrom} from "rxjs";
import {Course} from "../models/course.model";
import {GetCoursesResponse} from "../models/get-courses.response";


@Injectable({
  providedIn: "root"
})
export class CoursesService {
  //before loadAllCourses(): Observable<Course[]>
  async loadAllCourses(url: string): Promise<Course[]> {
    return []
  }

}
