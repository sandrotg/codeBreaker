import { NotFoundException } from "@nestjs/common";
import { UserCourse } from "src/domain/courses/entities/user-course.entity";
import { CourseRepositoryPort } from "src/domain/courses/repositories/course.repository.port";

export class GetLeaderBoardCourseUseCase {
    constructor(private readonly courseRepository: CourseRepositoryPort) { }

    async execute(nrc: number): Promise<UserCourse[] | null> {
        const course = await this.courseRepository.getByNrc(nrc);
        if(!course)throw new NotFoundException('Course not found');
        return this.courseRepository.getLeaderboard(nrc);
    }
}