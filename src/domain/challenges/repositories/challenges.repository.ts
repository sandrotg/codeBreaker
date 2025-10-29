import { Challenge } from "../entities/challenges.entity";
import { TestCase } from "../entities/testCases.entity";

export interface ChallengeRepository {
    save(challenge: Challenge): Promise<Challenge>
    findChallengeById(challengeId: string): Promise<Challenge | null>
    update(challenge: Challenge): Promise<Challenge>
    delete(challenge: Challenge): Promise<Challenge> 
    findAll(): Promise<Challenge[]>
    listTestCasesByChallengeId(challengeId: string): Promise<TestCase[]>
}