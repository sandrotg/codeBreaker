import { Injectable } from '@nestjs/common';
import type { EvaluationResultRepository } from 'src/domain/evaluations/repositories/evaluation-result.repository';
import { EvaluationResult } from 'src/domain/evaluations/entities/evaluation-result.entity';

@Injectable()
export class GetResultsByEvaluationUseCase {
    constructor(
        private readonly resultRepo: EvaluationResultRepository,
    ) {}

    async execute(evaluationId: string): Promise<EvaluationResult[]> {
        return await this.resultRepo.findByEvaluation(evaluationId);
    }
}
