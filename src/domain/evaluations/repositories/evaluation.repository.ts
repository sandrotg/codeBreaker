import { Challenge } from "src/domain/challenges/entities/challenges.entity";
import { Evaluation } from "../entities/evaluation.entity";

export interface EvaluationRepository {
    save(evaluation: Evaluation): Promise<Evaluation>
    findEvaluationById(evaluationId: string): Promise<Evaluation | null>
    delete(evaluation: Evaluation): Promise<Evaluation> 
    assignChallenges(evaluationId: string, challengeIds: string[]): Promise<void>;
    getChallengesInEvaluation(evaluationId: string): Promise<Challenge[]>;
}