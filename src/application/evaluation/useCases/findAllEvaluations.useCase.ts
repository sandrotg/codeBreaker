import { Evaluation } from "src/domain/evaluations/entities/evaluation.entity";
import { EvaluationRepository } from "src/domain/evaluations/repositories/evaluation.repository";

export class FindAllEvaluationsUseCase {
    constructor(private evaluationRepository: EvaluationRepository) {}
    async execute(): Promise<Evaluation[]> {
        return this.evaluationRepository.findAllEvaluations();
    }
}