import { NotFoundException } from "@nestjs/common";
import { CourseRepositoryPort } from "src/domain/courses/repositories/course.repository.port";
import { Evaluation } from "src/domain/evaluations/entities/evaluation.entity";

export class GetAllEvaluationsCourseUseCase {
    constructor(private readonly courseRepository: CourseRepositoryPort) { }

    async execute(nrc: number): Promise<Evaluation[]> {
        const course = await this.courseRepository.getByNrc(nrc);
        if (!course) throw new NotFoundException('Course not found');
        return this.courseRepository.getAllEvaluations(course);
    }
}