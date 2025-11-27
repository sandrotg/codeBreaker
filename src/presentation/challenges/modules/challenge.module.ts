import { Module } from "@nestjs/common";
import { ChallengeController } from "../controllers/challenges.controller";
import { CHALLENGE_REPOSITORY } from "src/application/tokens";
import { CreateChallengeUseCase } from "src/application/challenges/useCases/challenges/createChallenge.useCase";
import { DeleteChallengeUseCase } from "src/application/challenges/useCases/challenges/deleteChallenge.useCase";
import { findChallengeByIdUseCase } from "src/application/challenges/useCases/challenges/findChallengeById.useCase";
import { ListChallengesUseCase } from "src/application/challenges/useCases/challenges/listChallenges.useCase";
import { UpdateChallengeUseCase } from "src/application/challenges/useCases/challenges/updateChallenge.useCase";
import { ListTestCasesByChallengeIdUseCase } from "src/application/challenges/useCases/challenges/listTestCasesByChallengeId.useCase";
import { PrismaService } from "src/infrastructure/prisma.service";
import { PrismaChallengeRepository } from "src/infrastructure/challenges/prisma-challenge.repository";
import { ChallengeRepository } from "src/domain/challenges/repositories/challenges.repository";
import { UpdateStateUseCase } from "src/application/challenges/useCases/challenges/updateState.useCase";

@Module({
    controllers: [ChallengeController],
    providers: [
        PrismaService,
        {
            provide: CHALLENGE_REPOSITORY,
            useFactory: (prisma: PrismaService) => new PrismaChallengeRepository(prisma),
            inject: [PrismaService],
        },
        {
            provide: CreateChallengeUseCase,
            useFactory: (challengeRepository: ChallengeRepository) => new CreateChallengeUseCase(challengeRepository),
            inject: [CHALLENGE_REPOSITORY],
        },
        {
            provide: findChallengeByIdUseCase,
            useFactory: (challengeRepository: ChallengeRepository) => new findChallengeByIdUseCase(challengeRepository),
            inject: [CHALLENGE_REPOSITORY],
        },
        {
            provide: UpdateChallengeUseCase,
            useFactory: (challengeRepository: ChallengeRepository) => new UpdateChallengeUseCase(challengeRepository),
            inject: [CHALLENGE_REPOSITORY],
        },
        {
            provide: DeleteChallengeUseCase,
            useFactory: (challengeRepository: ChallengeRepository) => new DeleteChallengeUseCase(challengeRepository),
            inject: [CHALLENGE_REPOSITORY],
        },
        {
            provide: ListChallengesUseCase,
            useFactory: (challengeRepository: ChallengeRepository) => new ListChallengesUseCase(challengeRepository),
            inject: [CHALLENGE_REPOSITORY],
        },
        {
            provide: ListTestCasesByChallengeIdUseCase,
            useFactory: (challengeRepository: ChallengeRepository) => new ListTestCasesByChallengeIdUseCase(challengeRepository),
            inject: [CHALLENGE_REPOSITORY],
        },
        {
            provide: UpdateStateUseCase,
            useFactory: (challengeRepository: ChallengeRepository) => new UpdateStateUseCase(challengeRepository),
            inject: [CHALLENGE_REPOSITORY],
        }
    ],
})
export class ChallengeModule {}