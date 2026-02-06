import { LessonService } from './lesson.service';
import { LessonRepository } from '../repositories/lesson.repository';
import { Lesson } from '../models/lesson.model';

//fake data for tests for be independent of the actual repository implementation
jest.mock('../repositories/lesson.repository');

describe('LessonService', () => {
  let service: LessonService;
  let repository: jest.Mocked<LessonRepository>;

  const mockLessons: Lesson[] = [
    {
      id: 1,
      description: 'Angular basics',
      duration: '5:00',
      seqNo: 1,
      courseId: 10,
      videoId: 'vid-1'
    },
    {
      id: 2,
      description: 'Advanced Angular',
      duration: '7:00',
      seqNo: 2,
      courseId: 20,
      videoId: 'vid-2'
    }
  ];

  beforeEach(() => {
    repository = new LessonRepository() as jest.Mocked<LessonRepository>;

    repository.findAll.mockReturnValue(mockLessons);
    repository.findById.mockImplementation(
      (id: number) => mockLessons.find(l => l.id === id)
    );
    repository.create.mockImplementation(lesson => lesson);
    repository.update.mockImplementation(
      (id, changes) => ({ ...mockLessons[0], ...changes })
    );

    service = new LessonService();

    // Replace private repository — norma in tests to isolate 
    // service logic from repository implementation
    (service as any).repository = repository;
  });

  // ======================
  // searchLessons
  // ======================

  it('should return all lessons', () => {
    const result = service.searchLessons();
    expect(result.length).toBe(2);
  });

  it('should filter lessons by courseId', () => {
    const result = service.searchLessons(undefined, 10);
    expect(result.length).toBe(1);
    expect(result[0].courseId).toBe(10);
  });

  it('should filter lessons by query', () => {
    const result = service.searchLessons('advanced');
    expect(result.length).toBe(1);
    expect(result[0].description).toContain('Advanced');
  });

  // ======================
  // createLesson
  // ======================

  it('should create a new lesson', () => {
    const lesson = service.createLesson({
      description: 'New lesson',
      duration: '3:00',
      seqNo: 3,
      courseId: 30,
      videoId: 'vid-3'
    });

    expect(lesson.id).toBeDefined();
    expect(repository.create).toHaveBeenCalled();
  });

  // ======================
  // updateLesson
  // ======================

  it('should update an existing lesson', () => {
    const updated = service.updateLesson(1, {
      description: 'Updated description'
    });

    expect(updated.description).toBe('Updated description');
    expect(repository.update).toHaveBeenCalled();
  });

  it('should throw error if lesson not found', () => {
    repository.findById.mockReturnValue(undefined);

    expect(() => {
      service.updateLesson(999, { description: 'Fail' });
    }).toThrow('Lesson not found');
  });
});