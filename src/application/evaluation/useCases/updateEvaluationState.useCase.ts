import { EvaluationRepository } from 'src/domain/evaluations/repositories/evaluation.repository';
import { EvaluationState } from 'src/domain/evaluations/entities/evaluation.entity';

export class UpdateEvaluationStateUseCase {
    constructor(
        private readonly evaluationRepo: EvaluationRepository
    ) {}

    async execute(evaluationId: string, state: EvaluationState): Promise<void> {
        const evaluation = await this.evaluationRepo.findEvaluationById(evaluationId);
        if (!evaluation) {
            throw new Error('Evaluation not found');
        }
        await this.evaluationRepo.updateState(evaluationId, state);
    }
}
