import { NotFoundException } from "@nestjs/common";
import { Challenge } from "src/domain/challenges/entities/challenges.entity";
import { EvaluationRepository } from "src/domain/evaluations/repositories/evaluation.repository";

export class GetAllChallengesInEvaluationUseCase {
    constructor(private readonly evalRepo: EvaluationRepository){}

    async execute(evaluationId: string): Promise<Challenge[]>{
        const evaluation = await this.evalRepo.findEvaluationById(evaluationId);
        if(!evaluation) throw new NotFoundException('Evaluation not found');
        const challenges = await this.evalRepo.getChallengesInEvaluation(evaluationId);
        return challenges;
    }
}