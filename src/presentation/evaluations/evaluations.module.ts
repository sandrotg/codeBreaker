import { Module } from "@nestjs/common";
import { EvaluationController } from "./evaluations.controller";
import { EVALUATION_REPOSITORY, CHALLENGE_REPOSITORY } from "src/application/tokens";
import { CreateEvaluationUseCase } from 'src/application/evaluation/useCases/createEvaluation.useCase';
import { DeleteEvaluationUseCase } from 'src/application/evaluation/useCases/deleteEvaluation.useCase';
import { PrismaService } from "src/infrastructure/prisma.service";
import { PrismaEvaluationRepository } from "src/infrastructure/evaluation/prisma-evaluation.repository";
import { PrismaChallengeRepository } from "src/infrastructure/challenges/prisma-challenge.repository";
import { EvaluationRepository } from "src/domain/evaluations/repositories/evaluation.repository";
import { ChallengeRepository } from "src/domain/challenges/repositories/challenges.repository";

@Module({
    controllers: [EvaluationController],
    providers: [
        PrismaService,
        {
            provide: EVALUATION_REPOSITORY,
            useFactory: (prisma: PrismaService) => new PrismaEvaluationRepository(prisma),
            inject: [PrismaService],
        },
        {
            provide: CHALLENGE_REPOSITORY,
            useFactory: (prisma: PrismaService) => new PrismaChallengeRepository(prisma),
            inject: [PrismaService],
        },
        {
            provide: CreateEvaluationUseCase,
            useFactory: (evaluationRepo: EvaluationRepository, challengeRepo: ChallengeRepository) => new CreateEvaluationUseCase(evaluationRepo, challengeRepo),
            inject: [EVALUATION_REPOSITORY, CHALLENGE_REPOSITORY],
        },
        {
            provide: DeleteEvaluationUseCase,
            useFactory: (evaluationRepo: EvaluationRepository) => new DeleteEvaluationUseCase(evaluationRepo),
            inject: [EVALUATION_REPOSITORY],
        },
    ],
})
export class EvaluationModule { }