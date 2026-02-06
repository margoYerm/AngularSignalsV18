export interface Course {
  id: string;
  title: string;
  longDescription: string;
  seqNo: number;
  iconUrl: string;
  price: number;
  uploadedImageUrl?: string;
  courseListIcon?: string;
  category: string;
  lessonsCount: number;
}