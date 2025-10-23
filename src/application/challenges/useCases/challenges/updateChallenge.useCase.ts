import { Challenge } from "src/domain/challenges/entities/challenges.entity";
import { ChallengeRepository } from "src/domain/challenges/repositories/challenges.repository";
import { UpdateChallengeDto } from "../../dto/challenges/updateChallenge.dto";

export class UpdateChallengeUseCase {
    constructor(
        private readonly challengesRepo: ChallengeRepository
    ) { }

    async execute(challengeId: string, input: UpdateChallengeDto): Promise<Challenge> {
        const challenge = await this.challengesRepo.findChallengeById(challengeId);
        if (challenge) {
            if (challenge.state === 'Draft') {
                const updatedChallenge = new Challenge(
                    challengeId,
                    input.title ?? challenge.title,
                    input.difficulty ?? challenge.difficulty,
                    input.tags ?? challenge.tags,
                    input.timeLimit ?? challenge.timeLimit,
                    input.memoryLimit ?? challenge.memoryLimit,
                    input.description ?? challenge.description,
                    input.state ?? challenge.state
                )
                return await this.challengesRepo.update(updatedChallenge);
            }
            throw new Error(`this challenge is already published or archived`)
        }
        throw new Error(`there no challenge with id ${challengeId}`)
    }
}