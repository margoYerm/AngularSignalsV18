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
    query?: string, //Will be allows us search for lessons
  }): Promise<Lesson[]> {
    const {courseId, query} = config; 
    
    let params = new HttpParams();
    if (courseId) {
      //HttpParams is immutable, so we need set each new param
      //like code at the bottom, or use chaining
      params = params.set('courseId', courseId);
            
    }
    if (query) {
      params = params.set('query', query)
    }
    
    const lessons$ = this.http.get<GetLessonsResponse>(
      `${this.env.apiRoot}/search-lessons`, 
      {params}
    )
    const response = await firstValueFrom(lessons$);
    /*Debug 
    console.log('load lessons service params', params.toString())
    console.log('load Lessons service response', response.lessons);
    console.log('load Lessons service address', `${this.env.apiRoot}/search-lessons?${params.toString()}`);*/
    return response.lessons;
  }

  async saveLesson(
    lessonId: string, 
    changes: Partial<Lesson>): Promise<Lesson> {
      const saveLesson$ = this.http.put<Lesson>(
        `${this.env.apiRoot}/lessons/${lessonId}`, changes
      )

      return firstValueFrom (saveLesson$);
  }
}
