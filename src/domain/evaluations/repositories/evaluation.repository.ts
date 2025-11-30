import { Challenge } from "src/domain/challenges/entities/challenges.entity";
import { Evaluation, EvaluationState } from "../entities/evaluation.entity";

export interface EvaluationRepository {
    save(evaluation: Evaluation): Promise<Evaluation>
    findEvaluationById(evaluationId: string): Promise<Evaluation | null>
    delete(evaluation: Evaluation): Promise<Evaluation> 
    assignChallenges(evaluationId: string, challengeIds: string[]): Promise<void>;
    assignCourses(evaluationId: string, courseIds: string[]): Promise<void>;
    findAllEvaluations(): Promise<Evaluation[]>;
    getChallengesInEvaluation(evaluationId: string): Promise<Challenge[]>;
    updateState(evaluationId: string, state: EvaluationState): Promise<void>;
    findActiveEvaluationsByStudent(userId: string): Promise<Evaluation[]>;
}