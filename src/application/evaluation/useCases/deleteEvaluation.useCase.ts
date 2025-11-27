import { Evaluation } from "@prisma/client";
import { EvaluationRepository } from "src/domain/evaluations/repositories/evaluation.repository";

export class DeleteEvaluationUseCase {
    constructor(
        private readonly evaluationsRepo: EvaluationRepository
    ){}

    async execute(evaluationId: string): Promise<Evaluation> {
        const evaluation = await this.evaluationsRepo.findEvaluationById(evaluationId);
        if (evaluation) {
            return await this.evaluationsRepo.delete(evaluation);
        }
        throw new Error(`there no challenge with id ${evaluationId}`)
    }
}