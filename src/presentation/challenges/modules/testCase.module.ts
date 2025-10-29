import { Module } from '@nestjs/common';
import { TestCasesController } from '../controllers/testCases.controller';
import { CHALLENGE_REPOSITORY, TESTCASE_REPOSITORY } from 'src/application/tokens';
import { CreateTestCaseUseCase } from 'src/application/challenges/useCases/testCases/createTestCase.useCase';
import { DeleteTestCaseUseCase } from 'src/application/challenges/useCases/testCases/deleteTestCase.useCase';
import { FindTestCaseByIdUseCase } from 'src/application/challenges/useCases/testCases/findTestCaseById.seCase';
import { ListTestCasesUseCase } from 'src/application/challenges/useCases/testCases/listTestCases.useCase';
import { UpdateTestCaseUseCase } from 'src/application/challenges/useCases/testCases/updateTestCase.useCase';
import { PrismaService } from 'src/infrastructure/prisma.service';
import { PrismaTestCaseRepository } from 'src/infrastructure/challenges/prisma-testCase.repository';
import { TestCaseRepository } from 'src/domain/challenges/repositories/testCases.repository';
import { ChallengeRepository } from 'src/domain/challenges/repositories/challenges.repository';
import { PrismaChallengeRepository } from 'src/infrastructure/challenges/prisma-challenge.repository';

@Module({
    controllers: [TestCasesController],
    providers: [
        PrismaService,
        {
            provide: TESTCASE_REPOSITORY,
            useFactory: (prisma: PrismaService) => new PrismaTestCaseRepository(prisma),
            inject: [PrismaService],
        },
        {
            provide: CHALLENGE_REPOSITORY,
            useFactory: (prisma: PrismaService) => new PrismaChallengeRepository(prisma),
            inject: [PrismaService],
        },
        {
            provide: CreateTestCaseUseCase,
            useFactory: (ChallengeRepository: ChallengeRepository, testCaseRepository: TestCaseRepository) => new CreateTestCaseUseCase(ChallengeRepository, testCaseRepository),
            inject: [CHALLENGE_REPOSITORY, TESTCASE_REPOSITORY],
        },
        {
            provide: FindTestCaseByIdUseCase,
            useFactory: (testCaseRepository: TestCaseRepository) => new FindTestCaseByIdUseCase(testCaseRepository),
            inject: [TESTCASE_REPOSITORY],
        },
        {
            provide: UpdateTestCaseUseCase,
            useFactory: (testCaseRepository: TestCaseRepository) => new UpdateTestCaseUseCase(testCaseRepository),
            inject: [TESTCASE_REPOSITORY],
        },
        {
            provide: DeleteTestCaseUseCase,
            useFactory: (testCaseRepository: TestCaseRepository) => new DeleteTestCaseUseCase(testCaseRepository),
            inject: [TESTCASE_REPOSITORY],
        },
        {
            provide: ListTestCasesUseCase,
            useFactory: (testCaseRepository: TestCaseRepository) => new ListTestCasesUseCase(testCaseRepository),
            inject: [TESTCASE_REPOSITORY],
        }
    ]
})
export class TestCaseModule { }