import { Challenge } from "src/domain/challenges/entities/challenges.entity";
import { ChallengeRepository } from "src/domain/challenges/repositories/challenges.repository";

export class findChallengeByIdUseCase {
    constructor(
        private readonly challengesRepo: ChallengeRepository
    ){}

    async execute(challengeId: string): Promise<Challenge> {
        const challenge = await this.challengesRepo.findChallengeById(challengeId);
        if (challenge) {
            return challenge;
        }
        throw new Error(`there no challenge with id ${challengeId}`)
    }
}