
import express from 'express';
import {Application} from "express";
import {getAllCourses, getCourseById, createCourse, updateCourse as saveCourse, deleteCourse} from "./routes/course.routes";
import { saveLesson, searchLessons } from './routes/lesson.routes';
import { login } from './routes/auth.routes';


const bodyParser = require('body-parser');

const app: Application = express();

app.use(bodyParser.json());

const cors = require('cors');

app.use(cors({origin: true}));

app.route('/api/courses').get(getAllCourses);

app.route('/api/courses').post(createCourse);

app.route('/api/courses/:id').get(getCourseById);

app.route('/api/search-lessons').get(searchLessons);

app.route('/api/courses/:id').put(saveCourse);

app.route('/api/courses/:id').delete(deleteCourse);

app.route('/api/lessons/:id').put(saveLesson);

app.route('/api/login').post(login);

const httpServer = app.listen(9002, () => {
  const address = httpServer.address();
  const port = typeof address === 'object' && address !== null ? address.port : 9002;
  console.log("HTTP REST API Server running at http://localhost:" + port);
});
