import { TestCase } from "src/domain/challenges/entities/testCases.entity";
import { ChallengeRepository } from "src/domain/challenges/repositories/challenges.repository";

export class ListChallengesUseCase {
    constructor(
        private readonly challengesRepo: ChallengeRepository
    ){}

    async execute(challengeId: string): Promise<TestCase[]> {
        if (await this.challengesRepo.findChallengeById(challengeId)) {
            return await this.challengesRepo.listTestCasesByChallengeId(challengeId);
        }
        throw new Error(`there no challenge with id ${challengeId}`)
    }
}