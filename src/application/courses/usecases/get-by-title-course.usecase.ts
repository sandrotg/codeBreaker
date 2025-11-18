import { Course } from "src/domain/courses/entities/course.entity";
import { CourseRepositoryPort } from "src/domain/courses/repositories/course.repository.port";

export class GetByTitleCourseUseCase {
    constructor(private readonly courseRepository: CourseRepositoryPort) { }

    async execute(title: string): Promise<Course[]> {
        return this.courseRepository.getByTitle(title);
    }
}