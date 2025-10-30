import { Challenge } from "src/domain/challenges/entities/challenges.entity";
import { ChallengeRepository } from "src/domain/challenges/repositories/challenges.repository";

export class ListChallengesUseCase {
    constructor(
        private readonly challengesRepo: ChallengeRepository
    ){}

    async execute(): Promise<Challenge[]> {
        return await this.challengesRepo.findAll();
    }
}