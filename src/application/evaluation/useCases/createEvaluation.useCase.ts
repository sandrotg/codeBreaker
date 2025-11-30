import { Evaluation, EvaluationState } from 'src/domain/evaluations/entities/evaluation.entity';
import { randomUUID } from 'crypto';
import { CreateEvaluationDto } from '../dto/createEvaluation.dto';
import { EvaluationRepository } from 'src/domain/evaluations/repositories/evaluation.repository';
import { ChallengeRepository } from 'src/domain/challenges/repositories/challenges.repository';
import { DateParser } from 'src/domain/shared/date-parser.interface';

export class CreateEvaluationUseCase {
    constructor(
        private readonly evaluationRepo: EvaluationRepository,
        private readonly challengeRepo: ChallengeRepository,
        private readonly dateParser: DateParser
    ) { }

    async execute(input: CreateEvaluationDto): Promise<Evaluation> {

        let parsedDate: Date;
        const nowUTC = new Date();
        const offsetMinutes = 5 * 60;

        if (input.startAt) {
            // Intentar parsear como ISO primero (formato datetime-local)
            parsedDate = new Date(input.startAt);
            
            // Si no es válido, intentar con el parser personalizado
            if (isNaN(parsedDate.getTime())) {
                parsedDate = this.dateParser.parse(input.startAt);
            }
        } else {
            parsedDate = new Date();
        }

        const evaluation = new Evaluation(
            randomUUID(),
            input.name,
            parsedDate,
            input.duration,
            EvaluationState.INACTIVE,
            new Date(nowUTC.getTime() - offsetMinutes * 60 * 1000)
        );

        if (evaluation.startAt < evaluation.createdAt) {
            throw new Error("The start date must be in the future or present");
        }

        for (const challengeId of input.challengeIds) {
            const challenge = await this.challengeRepo.findChallengeById(challengeId);
            if (!challenge) {
                throw new Error(`Challenge ${challengeId} does not exist`);
            }
        }

        const savedEvaluation = await this.evaluationRepo.save(evaluation);
        await this.evaluationRepo.assignChallenges(savedEvaluation.evaluationId, input.challengeIds);
        
        // Asignar cursos si se proporcionaron
        if (input.courseIds && input.courseIds.length > 0) {
            await this.evaluationRepo.assignCourses(savedEvaluation.evaluationId, input.courseIds);
        }
        
        return savedEvaluation;
    }
}