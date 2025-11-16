import { Course } from "src/domain/courses/entities/course.entity";
import { CourseRepositoryPort } from "src/domain/courses/repositories/course.repository.port";

export class GetByNrcCourseUseCase {
    constructor(private readonly courseRepository: CourseRepositoryPort) {}

    async execute(nrc: number): Promise<Course | null> {
        return this.courseRepository.getByNrc(nrc);
    }
}