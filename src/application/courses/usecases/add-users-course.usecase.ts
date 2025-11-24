import { ConflictException, NotFoundException } from "@nestjs/common";
import { UserCourse } from "src/domain/courses/entities/user-course.entity";
import { CourseRepositoryPort } from "src/domain/courses/repositories/course.repository.port";
import { roleName } from "src/domain/users/entities/role.entity";
import { RoleRepository } from "src/domain/users/repositories/role.repository.port";
import { UserRepository } from "src/domain/users/repositories/user.repository.port";

export class AddUserToCourseUseCase {
    constructor(private readonly courseRepo: CourseRepositoryPort, private readonly userRepository: UserRepository, private readonly roleRepository: RoleRepository) { }

    async execute(nrc: number, userEmails: string[]): Promise<void> {
        const course = await this.courseRepo.getByNrc(nrc);
        if (!course) throw new Error("Course not found");
        const usersToAdd: UserCourse[] = [];
        for (const email of userEmails) {
            const user = await this.userRepository.findUserByEmail(email);
            if (!user) throw new NotFoundException(`User with email ${email} not found`);
            if (await this.courseRepo.checkUserinCourse(course, user.userId)) throw new ConflictException(`User with email ${email} is already in the course`);
            const rol = await this.roleRepository.findRoleById(user.roleId);
            if (rol?.name === roleName.ADMIN) {
                const userCourse = new UserCourse(
                    user.userId,
                    user.userName,
                    user.email,
                    user.roleId,
                )
                usersToAdd.push(userCourse);
            } else {
                const userCourse = new UserCourse(
                    user.userId,
                    user.userName,
                    user.email,
                    user.roleId,
                    0
                )
                usersToAdd.push(userCourse);
            }
        }
        await this.courseRepo.addUsers(course, usersToAdd);
    }
}