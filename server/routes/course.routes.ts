import {Request, Response} from "express";
import {CourseService} from "../services/course.service";
import { GetCoursesResponse } from "../models/dto/courses/get-courses.response";
import { GetCourseResponse } from "../models/dto/courses/get-course.response";
import { CreateCourseRequest } from "../models/dto/courses/create-course.request";
import { UpdateCourseRequest } from "../models/dto/courses/update-course.request";

const service = new CourseService();

export function getAllCourses(req: Request, res: Response) {
  const response: GetCoursesResponse = {
    courses: service.getAllCourses()
  };

  res.json(response);
}

export function getCourseById(req: Request, res: Response) {
  try {
    const response: GetCourseResponse = {
      course: service.getCourseById(Number(req.params['id']))
    };

    res.json(response);
  } catch (e: any) {
    res.status(404).json({ message: e.message });
  }
}

export function createCourse(
  req: Request<{}, {}, CreateCourseRequest>,
  res: Response
) {
  try {
    const course = service.createCourse(req.body);
    res.status(201).json(course);
  } catch (e: any) {
    res.status(400).json({message: e.message});
  }
}

export function updateCourse(
  req: Request<{ id: string }, {}, UpdateCourseRequest>,
  res: Response
) {
  try {
    const course = service.updateCourse(Number(req.params['id']), req.body);
    res.json(course);
  } catch (e: any) {
    res.status(400).json({message: e.message});
  }
}

export function deleteCourse(req: Request, res: Response) {
  try {
    service.deleteCourse(Number(req.params['id']));
    res.json({id: req.params['id']});
  } catch (e: any) {
    res.status(404).json({message: e.message});
  }
}