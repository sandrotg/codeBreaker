import { NotFoundException } from "@nestjs/common";
import { Challenge } from "src/domain/challenges/entities/challenges.entity";
import { CourseRepositoryPort } from "src/domain/courses/repositories/course.repository.port";

export class GetAllChallengesCourseUseCase {
    constructor(private readonly courseRepository: CourseRepositoryPort) { }

    async execute(nrc: number): Promise<Challenge[]> {
        const course = await this.courseRepository.getByNrc(nrc);
        if (!course) throw new NotFoundException('Course not found');
        return this.courseRepository.getAllChallenges(course);
    }
}