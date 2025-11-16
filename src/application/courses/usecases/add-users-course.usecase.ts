import { ConflictException, NotFoundException } from "@nestjs/common";
import { CourseRepositoryPort } from "src/domain/courses/repositories/course.repository.port";
import { UserRepository } from "src/domain/users/repositories/user.repository.port";

export class AddUserToCourseUseCase {
    constructor(private readonly courseRepo: CourseRepositoryPort,  private readonly userRepository: UserRepository) { }

    async execute(nrc: number, userEmails: string[]): Promise<void> {
        const course = await this.courseRepo.getByNrc(nrc);
        if (!course) throw new Error("Course not found");
        for(const email of userEmails) {
            const user = await this.userRepository.findUserByEmail(email);
            if(!user) throw new NotFoundException(`User with email ${email} not found`);
            if(this.courseRepo.checkUserinCourse(nrc, user.userId)) throw new ConflictException(`User with email ${email} is already in the course`);
        }
        await this.courseRepo.addUsers(nrc, userEmails);
    }
}