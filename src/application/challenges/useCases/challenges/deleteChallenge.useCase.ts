import { Challenge } from "src/domain/challenges/entities/challenges.entity";
import { ChallengeRepository } from "src/domain/challenges/repositories/challenges.repository";

export class DeleteChallengeUseCase {
    constructor(
        private readonly challengesRepo: ChallengeRepository
    ){}

    async execute(challengeId: string): Promise<Challenge> {
        const challenge = await this.challengesRepo.findChallengeById(challengeId);
        if (challenge) {
            return await this.challengesRepo.delete(challenge);
        }
        throw new Error(`there no challenge with id ${challengeId}`)
    }
}