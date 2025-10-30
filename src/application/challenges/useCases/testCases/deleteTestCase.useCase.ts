import { TestCase } from 'src/domain/challenges/entities/testCases.entity';
import { TestCaseRepository } from 'src/domain/challenges/repositories/testCases.repository';

export class DeleteTestCaseUseCase {
    constructor(
        private readonly testCaseRepo: TestCaseRepository
    ) { }

    async execute(testCaseId: string): Promise<TestCase> {
        const testcase = await this.testCaseRepo.findTestCaseById(testCaseId)
        if (testcase) {
            return await this.testCaseRepo.delete(testcase);
        }
        throw new Error(`there no test case with id ${testCaseId}`)
    }
}