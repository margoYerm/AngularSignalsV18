import {Request, Response} from "express";
import {LessonService} from "../services/lesson.service";
import { GetLessonsResponse } from "../models/dto/lessons/get-lessons.response";
import { CreateLessonRequest } from "../models/dto/lessons/create-lesson.request";
import { UpdateLessonRequest } from "../models/dto/lessons/update-lesson.request";

type SearchLessonsQuery = {
  query?: string;
  courseId?: string;
};

const service = new LessonService();

export function searchLessons(
  req: Request<{}, {}, {}, SearchLessonsQuery>, 
  res: Response
) {
  const { query, courseId } = req.query;

  const lessons = service.searchLessons(
    query,
    courseId ? Number(courseId) : undefined
  );

  const response: GetLessonsResponse = {lessons};

  res.json(response);
}

export function createLesson(
  req: Request<{}, {}, CreateLessonRequest>,
  res: Response
) {
  const lesson = service.createLesson(req.body);
  res.status(201).json(lesson);
}


export function saveLesson(
  req: Request<{ id: string }, {}, UpdateLessonRequest>,
  res: Response
) {
  const lesson = service.updateLesson(Number(req.params['id']), req.body);
  res.json(lesson);
}