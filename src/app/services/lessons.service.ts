import {inject, Injectable} from "@angular/core";
import {Lesson} from "../models/lesson.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {GetLessonsResponse} from "../models/get-lessons.response";
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class LessonsService {

  env = environment;
  http = inject(HttpClient);

  async loadLessons (config: {
    courseId?: string,
    query?: string //Will be allows us search for lessons
  }): Promise<Lesson[]> {
    const {courseId, query} = config; 
    let params = new HttpParams();
    if (courseId) {
      params.set('courseId', courseId);
    }
    if (query) {
      params.set('query', query)
    }
    const lessons$ = this.http.get<GetLessonsResponse>(
      `${this.env.apiRoot}/search-lessons`, 
      {params}
    )
    const response = await firstValueFrom(lessons$);
    return response.lessons;
  }
}
