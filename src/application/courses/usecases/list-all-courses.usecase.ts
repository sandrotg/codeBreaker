import { Course } from "src/domain/courses/entities/course.entity";
import { CourseRepositoryPort } from "src/domain/courses/repositories/course.repository.port";

export class ListAllCoursesUseCase {
    constructor(
        private readonly courseRepository: CourseRepositoryPort
    ) {}
    async execute(): Promise<Course[]> {
        return this.courseRepository.findAll();
    }
}