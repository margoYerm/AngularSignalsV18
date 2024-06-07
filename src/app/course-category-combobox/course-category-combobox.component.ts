import {Component, input, model} from '@angular/core';
import {CourseCategory} from "../models/course-category.model";

@Component({
  selector: 'course-category-combobox',
  standalone: true,
  imports: [],
  templateUrl: './course-category-combobox.component.html',
  styleUrl: './course-category-combobox.component.scss'
})
export class CourseCategoryComboboxComponent {
  //we will pass initial value to this input
  label = input.required<string>() //label of the dropdown

  //Model input (value) has the value of selected item (course category)
  //this works as an input and as an output
  value = model.required<CourseCategory>();

  constructor() {
    //this.label(); //it's input readonly 
    //this.value(); //can be set or update - writable signal
  }

  onCategoryChanged(category: string) {
    this.value.set(category as CourseCategory);
  }
}
