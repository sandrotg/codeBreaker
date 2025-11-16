import { Evaluation } from 'src/domain/evaluations/entities/evaluation.entity';
import { randomUUID } from 'crypto';
import { CreateEvaluationDto } from '../dto/createEvaluation.dto';
import { EvaluationRepository } from 'src/domain/evaluations/repositories/evaluation.repository';
import { ChallengeRepository } from 'src/domain/challenges/repositories/challenges.repository';

export class CreateEvaluationUseCase {
    constructor(
        private readonly evaluationRepo: EvaluationRepository,
        private readonly challengeRepo: ChallengeRepository
    ) { }

    async execute(input: CreateEvaluationDto): Promise<Evaluation> {

        const evaluation = new Evaluation(
            randomUUID(),
            input.name,
            input.date,
            input.duration
        );

        for (const challengeId of input.challengeIds) {
            const challenge = await this.challengeRepo.findChallengeById(challengeId);
            if (!challenge) {
                throw new Error(`Challenge ${challengeId} does not exist`);
            }
        }

        const savedEvaluation = await this.evaluationRepo.save(evaluation);
        await this.evaluationRepo.assignChallenges(savedEvaluation.evaluationId, input.challengeIds);
        return savedEvaluation;
    }
}