import { Challenge } from "src/domain/challenges/entities/challenges.entity";
import { ChallengeRepository } from "src/domain/challenges/repositories/challenges.repository";
import { State } from "src/domain/challenges/entities/challenges.entity";

export class UpdateStateUseCase {
    constructor(
        private readonly challengesRepo: ChallengeRepository
    ) { }

    async execute(challengeId: string, input: string): Promise<Challenge> {
        const challenge = await this.challengesRepo.findChallengeById(challengeId);
        if (challenge) {
            if (input === 'Published') {
                const updatedChallenge = new Challenge(
                    challengeId,
                    challenge.title,
                    challenge.difficulty,
                    challenge.tags,
                    challenge.timeLimit,
                    challenge.memoryLimit,
                    challenge.description,
                    State.PUBLISHED
                )
                return await this.challengesRepo.update(updatedChallenge);
            }
            if (input === 'Archived') {
                const updatedChallenge = new Challenge(
                    challengeId,
                    challenge.title,
                    challenge.difficulty,
                    challenge.tags,
                    challenge.timeLimit,
                    challenge.memoryLimit,
                    challenge.description,
                    State.ARCHIVED
                )
                return await this.challengesRepo.update(updatedChallenge);
            }
        }
        throw new Error(`there no challenge with id ${challengeId}`)
    }
}