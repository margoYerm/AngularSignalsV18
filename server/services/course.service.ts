import { Course } from "../models/course.model";
import { CreateCourseRequest } from "../models/dto/courses/create-course.request";
import { UpdateCourseRequest } from "../models/dto/courses/update-course.request";
import {CourseRepository} from "../repositories/course.repository";
import { Request, Response } from 'express';

export class CourseService {

  private repository = new CourseRepository();
  private static idCounter = 100;

  getAllCourses(): Course[] {
    return this.repository.findAll();
  }

  getCourseById(id: number): Course {
    const course = this.repository.findById(id);
    if (!course) {
      throw new Error("Course not found");
    }
    return course;
  }

  createCourse(data: CreateCourseRequest): Course {    
    if (!data?.title || data.title.length < 3) {
      throw new Error("Invalid course title");
    }

    const newCourse = {
      id: String(CourseService.idCounter),
      seqNo: CourseService.idCounter,
      lessonsCount: 0,
      ...data
    };

    CourseService.idCounter++;

    return this.repository.create(newCourse);
  }

  updateCourse(id: number, changes: UpdateCourseRequest): Course {    
    if (!this.repository.findById(id)) {
      throw new Error("Course not found");
    }
    return this.repository.update(id, changes);
  }

  deleteCourse(id: number): void {
    if (!this.repository.findById(id)) {
      throw new Error("Course not found");
    }
    this.repository.delete(id);
  }
}