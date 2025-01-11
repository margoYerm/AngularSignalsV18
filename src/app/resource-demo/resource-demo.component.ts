import {Component, effect, inject, resource, signal} from "@angular/core";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {environment} from "../../environments/environment";
import {Lesson} from "../models/lesson.model";


@Component({
  selector: 'resource-demo',
  templateUrl: './resource-demo.component.html',
  styleUrls: ['./resource-demo.component.scss'],
  imports: [MatProgressSpinner]
})
export class ResourceDemoComponent {
  env = environment;

  search = signal<string>('');

  //empty signals array
  //results that wa are getting from the backend
  //lessons = signal<Lesson[]>([]);

  //generics: lesson[] - result that we expect, {search: } data from the search string for fetch 
  lessons = resource<Lesson[], {search: string}>({
    //determine when the backend request is going to be made. 
    //when a new value in search will be emitted, request should be reloaded
    request: () => ({
      search: this.search() //possible multiple properties / src signals
    }),
    //to fetching 
    //abortSignal - fn for fetch that perform requests 
    loader: async ({request, abortSignal}) => {
      const response = await fetch(`${this.env.apiRoot}/search-lessons?query=${request.search}&courseId=18`, {
        signal: abortSignal
      });
      const json = await response.json();
      return json.lessons;
    }
  });

  constructor() {
    //we have many options for lessons when it is resource this.lessons.

    //this emits the search string as the user types it
    effect(() => {
      console.log(`searching lessons: `, this.search());
    })
  }

  searchLessons(search: string) {
    this.search.set(search);
  }

  reload() {}

  reset() {}
}