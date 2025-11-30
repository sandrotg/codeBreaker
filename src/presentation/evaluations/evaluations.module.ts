import { Module } from "@nestjs/common";
import { EvaluationController } from "./evaluations.controller";
import { EVALUATION_REPOSITORY, EVALUATION_RESULT_REPOSITORY, CHALLENGE_REPOSITORY, DATE_PARSER } from "src/application/tokens";
import { CreateEvaluationUseCase } from 'src/application/evaluation/useCases/createEvaluation.useCase';
import { DeleteEvaluationUseCase } from 'src/application/evaluation/useCases/deleteEvaluation.useCase';
import { PrismaService } from "src/infrastructure/prisma.service";
import { PrismaEvaluationRepository } from "src/infrastructure/evaluation/prisma-evaluation.repository";
import { PrismaEvaluationResultRepository } from "src/infrastructure/evaluation/prisma-evaluation-result.repository";
import { PrismaChallengeRepository } from "src/infrastructure/challenges/prisma-challenge.repository";
import { EvaluationRepository } from "src/domain/evaluations/repositories/evaluation.repository";
import { EvaluationResultRepository } from "src/domain/evaluations/repositories/evaluation-result.repository";
import { ChallengeRepository } from "src/domain/challenges/repositories/challenges.repository";
import { DateParser } from "src/domain/shared/date-parser.interface";
import { dateParser } from "src/infrastructure/date/date-parser";
import { GetEvaluationUseCase } from "src/application/evaluation/useCases/getEvaluationUseCase";
import { FindAllEvaluationsUseCase } from "src/application/evaluation/useCases/findAllEvaluations.useCase";
import { GetAllChallengesInEvaluationUseCase } from "src/application/evaluation/useCases/get-all-challenges.usecase";
import { UpdateEvaluationStateUseCase } from "src/application/evaluation/useCases/updateEvaluationState.useCase";
import { GetActiveEvaluationsByStudentUseCase } from "src/application/evaluation/useCases/getActiveEvaluationsByStudent.useCase";
import { CreateEvaluationResultUseCase } from "src/application/evaluation/useCases/createEvaluationResult.useCase";
import { UpdateEvaluationResultUseCase } from "src/application/evaluation/useCases/updateEvaluationResult.useCase";
import { GetResultsByEvaluationUseCase } from "src/application/evaluation/useCases/getResultsByEvaluation.useCase";
import { GetResultByUserAndEvaluationUseCase } from "src/application/evaluation/useCases/getResultByUserAndEvaluation.useCase";
import { DeleteEvaluationResultUseCase } from "src/application/evaluation/useCases/deleteEvaluationResult.useCase";

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
            provide: EVALUATION_RESULT_REPOSITORY,
            useFactory: (prisma: PrismaService) => new PrismaEvaluationResultRepository(prisma),
            inject: [PrismaService],
        },
        {
            provide: DATE_PARSER,
            useClass: dateParser,
        },
        {
            provide: CreateEvaluationUseCase,
            useFactory: (evaluationRepo: EvaluationRepository, challengeRepo: ChallengeRepository, dateParser: DateParser) => new CreateEvaluationUseCase(evaluationRepo, challengeRepo, dateParser),
            inject: [EVALUATION_REPOSITORY, CHALLENGE_REPOSITORY, DATE_PARSER],
        },
        {
            provide: DeleteEvaluationUseCase,
            useFactory: (evaluationRepo: EvaluationRepository) => new DeleteEvaluationUseCase(evaluationRepo),
            inject: [EVALUATION_REPOSITORY],
        },
        {
            provide: GetEvaluationUseCase,
            useFactory: (evaluationRepo: EvaluationRepository) => new GetEvaluationUseCase(evaluationRepo),
            inject: [EVALUATION_REPOSITORY],
        },
        {
            provide: FindAllEvaluationsUseCase,
            useFactory: (evaluationRepo: EvaluationRepository) => new FindAllEvaluationsUseCase(evaluationRepo),
            inject: [EVALUATION_REPOSITORY],
        },
        {
            provide: GetAllChallengesInEvaluationUseCase,
            useFactory: (evaluationRepo: EvaluationRepository) => new GetAllChallengesInEvaluationUseCase(evaluationRepo),
            inject: [EVALUATION_REPOSITORY],
        },
        {
            provide: UpdateEvaluationStateUseCase,
            useFactory: (evaluationRepo: EvaluationRepository) => new UpdateEvaluationStateUseCase(evaluationRepo),
            inject: [EVALUATION_REPOSITORY],
        },
        {
            provide: GetActiveEvaluationsByStudentUseCase,
            useFactory: (evaluationRepo: EvaluationRepository) => new GetActiveEvaluationsByStudentUseCase(evaluationRepo),
            inject: [EVALUATION_REPOSITORY],
        },
        {
            provide: CreateEvaluationResultUseCase,
            useFactory: (resultRepo: EvaluationResultRepository) => new CreateEvaluationResultUseCase(resultRepo),
            inject: [EVALUATION_RESULT_REPOSITORY],
        },
        {
            provide: UpdateEvaluationResultUseCase,
            useFactory: (resultRepo: EvaluationResultRepository) => new UpdateEvaluationResultUseCase(resultRepo),
            inject: [EVALUATION_RESULT_REPOSITORY],
        },
        {
            provide: GetResultsByEvaluationUseCase,
            useFactory: (resultRepo: EvaluationResultRepository) => new GetResultsByEvaluationUseCase(resultRepo),
            inject: [EVALUATION_RESULT_REPOSITORY],
        },
        {
            provide: GetResultByUserAndEvaluationUseCase,
            useFactory: (resultRepo: EvaluationResultRepository) => new GetResultByUserAndEvaluationUseCase(resultRepo),
            inject: [EVALUATION_RESULT_REPOSITORY],
        },
        {
            provide: DeleteEvaluationResultUseCase,
            useFactory: (resultRepo: EvaluationResultRepository) => new DeleteEvaluationResultUseCase(resultRepo),
            inject: [EVALUATION_RESULT_REPOSITORY],
        },
    ]
})
export class EvaluationModule { }