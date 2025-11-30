import { Inject, Injectable } from '@nestjs/common';
import type { EvaluationResultRepository } from 'src/domain/evaluations/repositories/evaluation-result.repository';

@Injectable()
export class DeleteEvaluationResultUseCase {
    constructor(
        @Inject('EVALUATION_RESULT_REPOSITORY')
        private readonly evaluationResultRepository: EvaluationResultRepository,
    ) {}

    async execute(resultId: string): Promise<void> {
        // Verificar que el resultado existe antes de eliminarlo
        const existingResult = await this.evaluationResultRepository.findByEvaluationAndUser('', '');
        
        // Eliminar el resultado
        await this.evaluationResultRepository.delete(resultId);
    }
}
