import {LESSONS} from "../db-data";
import { Lesson } from "../models/lesson.model";

export class LessonRepository {

  findAll() {
    return Object.values(LESSONS);
  }

  findById(id: number) {
    return LESSONS[id];
  }
  
  create(lesson: Lesson) {
    LESSONS[lesson.id] = lesson;
    return lesson;
  }

  update(id: number, changes: Partial<Lesson>): Lesson {
    LESSONS[id] = {
      ...LESSONS[id],
      ...changes
    };
    return LESSONS[id];
  }  
}