import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { TestCaseRepository } from "src/domain/challenges/repositories/testCases.repository";
import { TestCase } from "src/domain/challenges/entities/testCases.entity";

@Injectable()
export class PrismaTestCaseRepository implements TestCaseRepository {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async save(testCase: TestCase): Promise<TestCase> {
        const createdTestCase = await this.prisma.testCase.create({
            data: testCase
        });
        return createdTestCase;
    }

    async findTestCaseById(testCaseId: string): Promise<TestCase | null> {
        const testCase = await this.prisma.testCase.findUnique({
            where: { testCaseId: testCaseId }
        });
        return testCase;
    }

    async update(testCase: TestCase): Promise<TestCase> {
        const updatedTestCase = await this.prisma.testCase.update({
            where: { testCaseId: testCase.testCaseId },
            data: testCase
        });
        return updatedTestCase;
    }

    async delete(testCase: TestCase): Promise<TestCase> {
        const deletedTestCase = await this.prisma.testCase.delete({
            where: { testCaseId: testCase.testCaseId }
        });
        return deletedTestCase;
    }

    async findAll(): Promise<TestCase[]> {
        const testCases = await this.prisma.testCase.findMany();
        return testCases;
    }
}