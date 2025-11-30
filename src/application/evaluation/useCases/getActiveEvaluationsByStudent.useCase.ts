import { Evaluation } from 'src/domain/evaluations/entities/evaluation.entity';
import { EvaluationRepository } from 'src/domain/evaluations/repositories/evaluation.repository';

export class GetActiveEvaluationsByStudentUseCase {
    constructor(
        private readonly evaluationRepo: EvaluationRepository
    ) {}

    async execute(userId: string): Promise<Evaluation[]> {
        return await this.evaluationRepo.findActiveEvaluationsByStudent(userId);
    }
}
