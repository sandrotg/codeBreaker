import { Course } from "src/domain/courses/entities/course.entity";
import { CourseRepositoryPort } from "src/domain/courses/repositories/course.repository.port";
import { createCourseDto } from "../dto/create-course.dto";
import { UserRepository } from "src/domain/users/repositories/user.repository.port";
import { NotFoundException } from "@nestjs/common";

export class createCourseUsecase {
    constructor(private readonly courseRepository: CourseRepositoryPort, private readonly userRepository: UserRepository){}

    async execute(course: createCourseDto): Promise<Course>{

        const creator = await this.userRepository.findUserByEmail(course.creatorEmail);
        if(!creator)throw new NotFoundException("Creator user not found");
        const newCourse = new Course(
            crypto.randomUUID(),
            course.title,
            course.nrc,
            course.period,
            course.group
        );
        return await this.courseRepository.save(creator, newCourse);
    }
}