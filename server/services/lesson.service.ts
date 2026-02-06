import { CreateLessonRequest } from "../models/dto/lessons/create-lesson.request";
import { UpdateLessonRequest } from "../models/dto/lessons/update-lesson.request";
import { Lesson } from "../models/lesson.model";
import {LessonRepository} from "../repositories/lesson.repository";

export class LessonService {

  private repository = new LessonRepository();
  private static idCounter = 200;

  searchLessons(query?: string, courseId?: number): Lesson[] {
    let lessons: any[] = this.repository.findAll();

    if (courseId) {
      lessons = lessons.filter(
        lesson => lesson.courseId === courseId
      );
    }

    if (query) {
      lessons = lessons.filter(
        lesson => lesson.description
          ?.toLowerCase()
          .includes(query.toLowerCase())
      );
    }

    return lessons.slice(0, 10);
  }
  
  createLesson(data: CreateLessonRequest): Lesson {
    const lesson: Lesson = {
      id: LessonService.idCounter++,
      ...data
    };

    return this.repository.create(lesson);
  }

  updateLesson(id: number, changes: UpdateLessonRequest): Lesson {
    const lesson = this.repository.findById(id);

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    return this.repository.update(id, changes);
  }  
}