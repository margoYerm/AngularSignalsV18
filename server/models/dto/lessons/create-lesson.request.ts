export interface CreateLessonRequest {
  description: string;
  duration: string;
  seqNo: number;
  courseId: number;
  videoId: string;
}