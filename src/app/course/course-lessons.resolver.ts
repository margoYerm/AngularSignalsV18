import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { LessonsService } from "../services/lessons.service";
import { inject } from "@angular/core";
import { Lesson } from "../models/lesson.model";


export const courseLessonsResolver: ResolveFn<Lesson[]> = 
 async (route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const courseId = route.paramMap.get("courseId"); //router path variable
  if (!courseId) {
    return [];
  }
  const lessonsService = inject(LessonsService); 
  return lessonsService.loadLessons({courseId});
}