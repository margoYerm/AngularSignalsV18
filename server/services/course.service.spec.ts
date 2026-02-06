import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CourseService } from './course.service';
import { CourseRepository } from '../repositories/course.repository';
import { Course } from '../models/course.model';
import { CreateCourseRequest } from '../models/dto/courses/create-course.request';
import { UpdateCourseRequest } from '../models/dto/courses/update-course.request';

jest.mock('../repositories/course.repository');

describe('CourseService', () => {
  let service: CourseService;
  let repository: jest.Mocked<CourseRepository>;

  const mockCourses: Course[] = [
    {
      id: '1',
      seqNo: 1,
      title: 'Angular Basics',
      longDescription: 'Intro to Angular',
      iconUrl: 'icon1.png',
      price: 50,
      category: 'BEGINNER',
      lessonsCount: 5
    },
    {
      id: '2',
      seqNo: 2,
      title: 'Angular Advanced',
      longDescription: 'Advanced Angular',
      iconUrl: 'icon2.png',
      price: 75,
      category: 'ADVANCED',
      lessonsCount: 8
    }
  ];

  beforeEach(() => {
    repository = new CourseRepository() as jest.Mocked<CourseRepository>;
    (CourseService as any).idCounter = 100;

    repository.findAll.mockReturnValue(mockCourses);
    repository.findById.mockImplementation(id => mockCourses.find(c => Number(c.id) === id));
    repository.create.mockImplementation(course => course);
    repository.update.mockImplementation((id, changes) => ({ ...mockCourses.find(c => Number(c.id) === id), ...changes } as Course));
    repository.delete.mockImplementation(id => {});

    service = new CourseService();
    (service as any).repository = repository; 
  });

  it('should return all courses', () => {
    const result = service.getAllCourses();
    expect(result).toEqual(mockCourses);
  });

  it('should return course by id', () => {
    const result = service.getCourseById(1);
    expect(result).toEqual(mockCourses[0]);
  });

  it('should throw error if course not found', () => {
    expect(() => service.getCourseById(999)).toThrow('Course not found');
  });

  it('should create a new course', () => {
    const newCourseData: CreateCourseRequest = {
      title: 'New Course',
      longDescription: 'Description',
      iconUrl: 'icon3.png',
      price: 100,
      category: 'BEGINNER'
    };

    const result = service.createCourse(newCourseData);
    expect(result).toEqual(expect.objectContaining({
      title: 'New Course',
      longDescription: 'Description',
      iconUrl: 'icon3.png',
      price: 100,
      category: 'BEGINNER'
    }));
    expect(result.id).toBeDefined();
  });

  it('should throw error for invalid course title', () => {
    const badCourse: CreateCourseRequest = {
      title: 'A',
      longDescription: 'desc',
      iconUrl: 'icon.png',
      price: 10,
      category: 'BEGINNER'
    };
    expect(() => service.createCourse(badCourse)).toThrow('Invalid course title');
  });

  it('should update a course', () => {
    const changes: UpdateCourseRequest = {
      title: 'Updated Title'
    };
    const result = service.updateCourse(1, changes);
    expect(result.title).toEqual('Updated Title');
  });

  it('should throw error when updating non-existing course', () => {
    expect(() => service.updateCourse(999, { title: 'x' })).toThrow('Course not found');
  });

  it('should delete a course', () => {
    expect(() => service.deleteCourse(1)).not.toThrow();
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw error when deleting non-existing course', () => {
    repository.findById.mockReturnValueOnce(undefined);
    expect(() => service.deleteCourse(999)).toThrow('Course not found');
  });
});