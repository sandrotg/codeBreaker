import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ChallengeRepository } from "src/domain/challenges/repositories/challenges.repository";
import { Challenge } from "src/domain/challenges/entities/challenges.entity";
import { TestCase } from "src/domain/challenges/entities/testCases.entity";

@Injectable()
export class PrismaChallengeRepository implements ChallengeRepository {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async save(challenge: Challenge): Promise<Challenge> {
        const createdChallenge = await this.prisma.challenge.create({
            data: challenge
        });
        return createdChallenge as unknown as Challenge;
    }

    async findChallengeById(challengeId: string): Promise<Challenge | null> {
        const challenge = await this.prisma.challenge.findUnique({
            where: { challengeId: challengeId}
        });
        return challenge as unknown as Challenge | null;
    }

    async update(challenge: Challenge): Promise<Challenge> {
        const updatedChallenge = await this.prisma.challenge.update({
            where: { challengeId: challenge.challengeId },
            data: challenge
        });
        return updatedChallenge as unknown as Challenge;
    }

    async delete(challenge: Challenge): Promise<Challenge> {
        const deletedChallenge = await this.prisma.challenge.delete({
            where: { challengeId: challenge.challengeId }
        });
        return deletedChallenge as unknown as Challenge;
    }

    async findAll(): Promise<Challenge[]> {
        const challenges = await this.prisma.challenge.findMany();
        return challenges as unknown as Challenge[];
    }

    async listTestCasesByChallengeId(challengeId: string): Promise<TestCase[]> {
        const challengeWithTests = await this.prisma.challenge.findUnique({
            where: { challengeId: challengeId },
            include: { testCases: true }
        });
        return (challengeWithTests?.testCases as unknown as TestCase[]) ?? [];
    }
}