import { EvaluationResult } from '../entities/evaluation-result.entity';

export interface EvaluationResultRepository {
    create(result: EvaluationResult): Promise<EvaluationResult>;
    update(resultId: string, submissionIds: string[], score: number, completedAt: Date): Promise<EvaluationResult>;
    findByEvaluationAndUser(evaluationId: string, userId: string): Promise<EvaluationResult | null>;
    findByEvaluation(evaluationId: string): Promise<EvaluationResult[]>;
    findByUser(userId: string): Promise<EvaluationResult[]>;
    delete(resultId: string): Promise<void>;
}
