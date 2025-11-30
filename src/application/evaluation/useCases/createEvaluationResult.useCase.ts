import { Injectable } from '@nestjs/common';
import type { EvaluationResultRepository } from 'src/domain/evaluations/repositories/evaluation-result.repository';
import { EvaluationResult } from 'src/domain/evaluations/entities/evaluation-result.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateEvaluationResultUseCase {
    constructor(
        private readonly resultRepo: EvaluationResultRepository,
    ) {}

    async execute(
        evaluationId: string,
        userId: string,
        totalChallenges: number,
    ): Promise<EvaluationResult> {
        // Verificar si ya existe un resultado para este usuario y evaluación
        const existing = await this.resultRepo.findByEvaluationAndUser(
            evaluationId,
            userId,
        );

        if (existing) {
            throw new Error('El usuario ya tiene un resultado registrado para esta evaluación');
        }

        const result = new EvaluationResult(
            uuidv4(),
            evaluationId,
            userId,
            [],
            null,
            totalChallenges,
            new Date(),
            null,
        );

        return await this.resultRepo.create(result);
    }
}
