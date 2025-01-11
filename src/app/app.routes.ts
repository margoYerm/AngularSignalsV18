import {Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {LessonsComponent} from "./lessons/lessons.component";
import { isUserAuthenticated } from './guards/auth.guard';
import { CourseComponent } from './course/course.component';
import { courseResolver } from './course/course.resolver';
import { courseLessonsResolver } from './course/course-lessons.resolver';
import { ToObservableComponent } from './to-observable/to-observable.component';
import { LinkedSignalDemoComponent } from './linked-signal/linked-signal.component';
import { ResourceDemoComponent } from './resource-demo/resource-demo.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [isUserAuthenticated]
  },
  {
    path: 'courses/:courseId',
    component: CourseComponent,
    canActivate: [isUserAuthenticated],
    resolve: {
      course: courseResolver,
      lessons: courseLessonsResolver,
    }
  },
  {
    path: "info",
    component: ToObservableComponent,
    canActivate: [isUserAuthenticated],
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "lessons",
    component: LessonsComponent
  },

  {
    path:"shopping-cart",
    component: LinkedSignalDemoComponent
  },
  {
    path: "resource-demo",
    component: ResourceDemoComponent
  },
  
  {
    path: '**',
    redirectTo: '/'
  }
];
