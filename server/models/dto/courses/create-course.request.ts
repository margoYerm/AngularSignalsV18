export interface CreateCourseRequest {
  title: string;
  longDescription: string;
  iconUrl: string;
  price: number;
  category: string;
  uploadedImageUrl?: string;
  courseListIcon?: string;
}


//no id and seqNo — it's responsibility of backend