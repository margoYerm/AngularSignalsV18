import {COURSES} from "../db-data";
import { Course } from "../models/course.model";

export class CourseRepository {

  findAll(): Course[] {
    return Object.values(COURSES) as Course[];
  }

  findById(id: number): Course | undefined {
    return COURSES[id];
  }

  create(course: Course): Course {
    COURSES[course.id] = course;
    return course;
  }

  update(id: number, changes: Partial<Course>): Course {
    COURSES[id] = {
      ...COURSES[id],
      ...changes
    };
    return COURSES[id];
  }

  delete(id: number) {
    delete COURSES[id];
  }
}