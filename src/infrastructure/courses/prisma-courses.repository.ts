import { CourseRepositoryPort } from "src/domain/courses/repositories/course.repository.port";
import { PrismaService } from "../prisma.service";
import { Course } from "src/domain/courses/entities/course.entity";
import { User } from "src/domain/users/entities/user.entity";
import { UserCourse } from "src/domain/courses/entities/user-course.entity";
import { Challenge, Difficulty, State } from "src/domain/challenges/entities/challenges.entity";

export class PrismaCoursesRepository implements CourseRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async save(admin: User, course: Course): Promise<Course> {
        const createdCourse = await this.prisma.course.create({
            data: {
                courseId: course.courseId,
                title: course.title,
                nrc: course.nrc,
                period: course.period,
                group: course.group,
            }
        })
        await this.prisma.userCourse.create({
            data: {
                userId: admin.userId,
                courseId: createdCourse.courseId,
            }
        })

        return new Course(
            createdCourse.courseId,
            createdCourse.title,
            createdCourse.nrc,
            createdCourse.period,
            createdCourse.group
        );
    }

    async addUsers(course: Course, users: UserCourse[]): Promise<void> {
        for (const user of users) {
            await this.prisma.userCourse.create({
                data: {
                    userId: user.userId,
                    courseId: course.courseId,
                    ...(user.score !== undefined && { score: user.score })
                }
            })
        }
    }

    async getAllUsers(course: Course): Promise<UserCourse[]> {
        const users = await this.prisma.userCourse.findMany({
            where: {
                courseId: course.courseId
            },
            include: {
                user: true
            }
        });
        const userCourse = users.map(user => new UserCourse(
            user.userId,
            user.user.userName,
            user.user.email,
            user.user.roleId,
            user.score ?? undefined
        ));
        return userCourse;
    }

    async getByNrc(nrc: number): Promise<Course | null> {
        const course = await this.prisma.course.findUnique({
            where: { nrc },
        });
        if (!course) return null;
        return new Course(
            course.courseId,
            course.title,
            course.nrc,
            course.period,
            course.group
        );
    }

    async getByTitle(title: string): Promise<Course[]> {
        const courses = await this.prisma.course.findMany({
            where: {
                title: {
                    contains: title,
                    mode: 'insensitive'
                },
            }
        });
        return courses.map(course => new Course(
            course.courseId,
            course.title,
            course.nrc,
            course.period,
            course.group
        ));
    }

    async addChallenge(course: Course, challengeId: string): Promise<void> {
        await this.prisma.challengeCourse.create({
            data: {
                courseId: course.courseId,
                challengeId: challengeId,
            }
        });
    }

    async getAllChallenges(course: Course): Promise<Challenge[]> {
        const challenges = await this.prisma.challengeCourse.findMany({
            where: { courseId: course.courseId },
            include: {
                challenge: true,
            }
        });
        return challenges.map(c => new Challenge(
            c.challenge.challengeId,
            c.challenge.title,
            c.challenge.difficulty as Difficulty,
            c.challenge.tags,
            c.challenge.timeLimit,
            c.challenge.memoryLimit,
            c.challenge.description,
            c.challenge.state as State
        ));
    }

    async checkUserinCourse(course: Course, userId: string): Promise<boolean> {
        const userCourse = await this.prisma.userCourse.findFirst({
            where: {
                userId: userId,
                courseId: course.courseId
            }
        });
        return userCourse ? true : false;
    }

    async findAll(): Promise<Course[]> {
        const courses = await this.prisma.course.findMany();
        return courses.map(course => new Course(
            course.courseId,
            course.title,
            course.nrc,
            course.period,
            course.group
        ));
    }
}
