import { Injectable } from '@nestjs/common';
import type { EvaluationResultRepository } from 'src/domain/evaluations/repositories/evaluation-result.repository';
import { EvaluationResult } from 'src/domain/evaluations/entities/evaluation-result.entity';

@Injectable()
export class GetResultByUserAndEvaluationUseCase {
    constructor(
        private readonly resultRepo: EvaluationResultRepository,
    ) {}

    async execute(
        evaluationId: string,
        userId: string,
    ): Promise<EvaluationResult | null> {
        return await this.resultRepo.findByEvaluationAndUser(evaluationId, userId);
    }
}
