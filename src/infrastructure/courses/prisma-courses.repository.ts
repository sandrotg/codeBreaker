import { CourseRepositoryPort } from "src/domain/courses/repositories/course.repository.port";
import { PrismaService } from "../prisma.service";
import { Course } from "src/domain/courses/entities/course.entity";

export class PrismaCoursesRepository implements CourseRepositoryPort {
    constructor(private readonly prisma: PrismaService){}

    async save(emailCreator: string, course: Course): Promise<Course> {
        const createdCourse = await this.prisma.course.create({

        })
    }
}