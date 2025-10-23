import { TestCase } from "../entities/testCases.entity";

export interface TestCaseRepository {
    save(testCase: TestCase): Promise<TestCase>
    findTestCaseById(testCaseId: string): Promise<TestCase | null>
    update(testCase: TestCase): Promise<TestCase>
    delete(testCase: TestCase): Promise<TestCase> 
    findAll(): Promise<TestCase[]>
}