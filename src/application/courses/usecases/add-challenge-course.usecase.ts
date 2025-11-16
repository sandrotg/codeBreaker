import { NotFoundException } from "@nestjs/common";
import { ChallengeRepository } from "src/domain/challenges/repositories/challenges.repository";
import { CourseRepositoryPort } from "src/domain/courses/repositories/course.repository.port";

export class AddChanllengeToCourseUseCase {
    constructor(private readonly courseRepository: CourseRepositoryPort, private readonly challengeRepository: ChallengeRepository) {}

    async execute(nrc: number, challengeId: string): Promise<void> {
        const course = await this.courseRepository.getByNrc(nrc);
        if (!course) throw new NotFoundException('Course not found');
        const challenge = await this.challengeRepository.findChallengeById(challengeId);
        if (!challenge) throw new NotFoundException('Challenge not found');
        await this.courseRepository.addChallenge(nrc, challengeId);
    }
}