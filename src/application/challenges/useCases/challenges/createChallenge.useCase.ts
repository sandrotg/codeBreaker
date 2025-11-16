import { Challenge } from 'src/domain/challenges/entities/challenges.entity';
import { randomUUID } from 'crypto';
import { CreateChallengeDto } from '../../dto/challenges/createChallenge.dto';
import { ChallengeRepository } from 'src/domain/challenges/repositories/challenges.repository';
import { State } from 'src/domain/challenges/entities/challenges.entity';

export class CreateChallengeUseCase {
    constructor(
        private readonly challengesRepo: ChallengeRepository
    ) {}

    async execute(input: CreateChallengeDto): Promise<Challenge> {
        const challenge = new Challenge(
            randomUUID(),
            input.title,
            input.difficulty,
            input.tags,
            input.timeLimit,
            input.memoryLimit,
            input.description,
            State.DRAFT
        );
        return await this.challengesRepo.save(challenge);
    }
}