import { TestCase } from 'src/domain/challenges/entities/testCases.entity';
import { TestCaseRepository } from 'src/domain/challenges/repositories/testCases.repository';
import { UpdateTestCaseDto } from '../../dto/testCases/updateTestCase.dto';

export class UpdateTestCaseUseCase {
    constructor(
        private readonly testCaseRepo: TestCaseRepository
    ) { }

    async execute(testCaseId: string, input: UpdateTestCaseDto): Promise<TestCase> {
        const testcase = await this.testCaseRepo.findTestCaseById(testCaseId)
        if (testcase) {
            const updatedTestCase = new TestCase(
                testCaseId,
                input.challengeId ?? testcase.challengeId,
                input.input ?? testcase.input,
                input.output ?? testcase.output
            );
            return await this.testCaseRepo.update(updatedTestCase);
        }
        throw new Error(`there no test case with id ${testCaseId}`)
    }
}