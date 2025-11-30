import { NotFoundException } from "@nestjs/common";
import { CourseRepositoryPort } from "src/domain/courses/repositories/course.repository.port";
import { EvaluationRepository } from "src/domain/evaluations/repositories/evaluation.repository";

export class AddEvaluationToCourseUseCase {
    constructor(private readonly courseRepo: CourseRepositoryPort, private readonly evalRepo: EvaluationRepository){}

    async execute(nrc: number, evaluationId: string): Promise<void> {
        const course = await this.courseRepo.getByNrc(nrc);
        if (!course) throw new NotFoundException('Course not found');
        const evaluation = await this.evalRepo.findEvaluationById(evaluationId);
        if(!evaluation) throw new NotFoundException('Evaluation not found');
        await this.courseRepo.addEvaluation(course, evaluationId);
    }
}