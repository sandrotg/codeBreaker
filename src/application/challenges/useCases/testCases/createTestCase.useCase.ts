import { TestCase } from 'src/domain/challenges/entities/testCases.entity';
import { randomUUID } from 'crypto';
import { ChallengeRepository } from 'src/domain/challenges/repositories/challenges.repository';
import { CreateTestCaseDto } from '../../dto/testCases/createTestCase.dto';
import { TestCaseRepository } from 'src/domain/challenges/repositories/testCases.repository';

export class CreateTestCaseUseCase {
    constructor(
        private readonly challengesRepo: ChallengeRepository,
        private readonly testCaseRepo: TestCaseRepository
    ) { }

    async execute(input: CreateTestCaseDto): Promise<TestCase> {
        if (await this.challengesRepo.findChallengeById(input.challengeId)) {
            const testCase = new TestCase(
                randomUUID(),
                input.challengeId,
                input.input,
                input.output
            );
            return await this.testCaseRepo.save(testCase);
        }
        throw new Error(`there no challenge with id ${input.challengeId}`)
    }
}