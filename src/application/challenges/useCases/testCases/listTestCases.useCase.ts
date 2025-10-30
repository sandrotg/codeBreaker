import { TestCase } from 'src/domain/challenges/entities/testCases.entity';
import { TestCaseRepository } from 'src/domain/challenges/repositories/testCases.repository';

export class ListTestCasesUseCase {
    constructor(
        private readonly testCaseRepo: TestCaseRepository
    ) { }

    async execute(): Promise<TestCase[]> {
        return await this.testCaseRepo.findAll();
    }
}