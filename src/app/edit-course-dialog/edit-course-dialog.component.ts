import {Component, effect, inject, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Course} from "../models/course.model";
import {EditCourseDialogData} from "./edit-course-dialog.data.model";
import {CoursesService} from "../services/courses.service";
import {LoadingIndicatorComponent} from "../loading/loading.component";
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {CourseCategoryComboboxComponent} from "../course-category-combobox/course-category-combobox.component";
import {CourseCategory} from "../models/course-category.model";
import { firstValueFrom } from 'rxjs';
import { MessagesService } from '../messages/messages.service';

@Component({
  selector: 'edit-course-dialog',
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    ReactiveFormsModule,
    CourseCategoryComboboxComponent
  ],
  templateUrl: './edit-course-dialog.component.html',
  styleUrl: './edit-course-dialog.component.scss'
})
export class EditCourseDialogComponent {
  dialogRef = inject(MatDialogRef); //reference to the dialog

  //retrieving data from the target cours for fill form
  data: EditCourseDialogData = inject(MAT_DIALOG_DATA);

  //creating form for edit data 
  fb = inject(FormBuilder);
  form = this.fb.group({
    title: [''],
    longDescription: [''],
    //category: [''],
    iconUrl: [''],
  });

  courseService = inject(CoursesService);

  messagesService = inject(MessagesService);

  //input for child model signal with initial value BEGINNER
  category = signal<CourseCategory>("BEGINNER");

  constructor() {
    //patchValue() using for fill only partial controls of the form 
    //(from server to the template)
    this.form.patchValue({
      title: this.data?.course?.title,
      longDescription: this.data?.course?.longDescription,
      //category: this.data?.course?.category,
      iconUrl: this.data?.course?.iconUrl,
    })

    //Set initial value to model signal category
    this.category.set(this.data?.course?.category ?? 'BEGINNER');
    //For see how works model signal category
    effect(() => {
      console.log(`Course category bi-directional binding: ${this.category()}`);
    })
  }

  onClose() {
    //row for check that it works, some time we need pass obj 
    //this.dialogRef.close({title: 'HelloWorld, MatDialogRef'});
    this.dialogRef.close();
  }

  async onSave() {
    const courseProps = this.form.value as Partial<Course>;
    courseProps.category = this.category(); //adding value from the model signal
    if (this.data?.mode === 'update') { //this is a custom type 
      await this.saveCourse(this.data?.course!.id, courseProps)
    } else if (this.data.mode === 'create') {
      await this.createCourse(courseProps);
    }
  }

  async createCourse (course: Partial<Course>) {
    try {
      const newCourse = await this.courseService.createCourse(course);
      this.dialogRef.close(newCourse);
    } catch(err) {
      console.error(err);
      this.messagesService.showMessage('Error creating the course', 'error');      
    }
  }

  async saveCourse(courseId: string, changes: Partial<Course>) {
    try {
      const updatedCourse = 
        await this.courseService.saveCourse(courseId, changes);
      this.dialogRef.close(updatedCourse);
    } catch (err){
      console.error(err);
      this.messagesService.showMessage('Failed to save the course.', 'error');      
    }
  }
}

export async function openEditCourseDialog(
  dialog: MatDialog,
  data: EditCourseDialogData //this is a custom type 
  ) {
    //this is material dialog configuration
    const config = new MatDialogConfig();
    config.disableClose = true;
    config.autoFocus = true;
    config.width = '400px';
    config.data = data;
    const close$ = dialog.open(EditCourseDialogComponent, config)
      .afterClosed();
    
    //this Observable wait initial value from Observable and than 
    //Promise will be resolved automatically. 
    return firstValueFrom(close$); 
  }
