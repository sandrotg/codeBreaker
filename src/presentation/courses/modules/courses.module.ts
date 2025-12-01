import { Module } from "@nestjs/common";
import { CoursesController } from "../controllers/courses.controller";
import { PrismaService } from "src/infrastructure/prisma.service";
import { CHALLENGE_REPOSITORY, COURSE_REPOSITORY, EVALUATION_REPOSITORY, ROLE_REPOSITORY, USER_REPOSITORY } from "src/application/tokens";
import { PrismaCoursesRepository } from "src/infrastructure/courses/prisma-courses.repository";
import { PrismaUserRepository } from "src/infrastructure/users/database/prisma-user.repository";
import { PrismaRoleRepository } from "src/infrastructure/users/database/prisma-role.repository";
import { PrismaChallengeRepository } from "src/infrastructure/challenges/prisma-challenge.repository";
import { createCourseUsecase } from "src/application/courses/usecases/create-course.usecase";
import { CourseRepositoryPort } from "src/domain/courses/repositories/course.repository.port";
import { UserRepository } from "src/domain/users/repositories/user.repository.port";
import { AddChanllengeToCourseUseCase } from "src/application/courses/usecases/add-challenge-course.usecase";
import { ChallengeRepository } from "src/domain/challenges/repositories/challenges.repository";
import { AddUserToCourseUseCase } from "src/application/courses/usecases/add-users-course.usecase";
import { RoleRepository } from "src/domain/users/repositories/role.repository.port";
import { GetAllChallengesCourseUseCase } from "src/application/courses/usecases/get-all-challenges.usecase";
import { GetAllUsersInCourseUseCase } from "src/application/courses/usecases/get-all-users.usecase";
import { GetCourseByNrcUseCase } from "src/application/courses/usecases/get-by-nrc-course.usecase";
import { GetCourseByTitleUseCase } from "src/application/courses/usecases/get-by-title-course.usecase";
import { ListAllCoursesUseCase } from "src/application/courses/usecases/list-all-courses.usecase";
import { AddEvaluationToCourseUseCase } from "src/application/courses/usecases/add-evaluation-course.usecase";
import { EvaluationRepository } from "src/domain/evaluations/repositories/evaluation.repository";
import { PrismaEvaluationRepository } from "src/infrastructure/evaluation/prisma-evaluation.repository";
import { GetAllEvaluationsCourseUseCase } from "src/application/courses/usecases/get-all-evaluations.usecase";
import { JwtStrategy } from "src/presentation/shared/strategies/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get('JWT_SECRET'),
                signOptions: { expiresIn: '15m' },
            }),
        }),
    ],
    controllers: [CoursesController],
    providers: [
        PrismaService,
        JwtStrategy,
        {
            provide: COURSE_REPOSITORY,
            useFactory: (prisma: PrismaService) => new PrismaCoursesRepository(prisma),
            inject: [PrismaService]
        },
        {
            provide: USER_REPOSITORY,
            useFactory: (prisma: PrismaService) => new PrismaUserRepository(prisma),
            inject: [PrismaService]
        },
        {
            provide: ROLE_REPOSITORY,
            useFactory: (prisma: PrismaService) => new PrismaRoleRepository(prisma),
            inject: [PrismaService]
        },
        {
            provide: CHALLENGE_REPOSITORY,
            useFactory: (prisma: PrismaService) => new PrismaChallengeRepository(prisma),
            inject: [PrismaService]
        },
        {
            provide: EVALUATION_REPOSITORY,
            useFactory: (prisma: PrismaService) => new PrismaEvaluationRepository(prisma),
            inject: [PrismaService]
        },
        {
            provide: createCourseUsecase,
            useFactory: (courseRepo: CourseRepositoryPort, userRepo: UserRepository) => new createCourseUsecase(courseRepo, userRepo),
            inject: [COURSE_REPOSITORY, USER_REPOSITORY]
        },
        {
            provide: AddChanllengeToCourseUseCase,
            useFactory: (courseRepo: CourseRepositoryPort, challengeRepo: ChallengeRepository) => new AddChanllengeToCourseUseCase(courseRepo, challengeRepo),
            inject: [COURSE_REPOSITORY, CHALLENGE_REPOSITORY]
        },
        {
            provide: AddUserToCourseUseCase,
            useFactory: (courseRepo: CourseRepositoryPort, userRepo: UserRepository, roleRepo: RoleRepository) => new AddUserToCourseUseCase(courseRepo, userRepo, roleRepo),
            inject: [COURSE_REPOSITORY, USER_REPOSITORY, ROLE_REPOSITORY]
        },
        {
            provide: AddEvaluationToCourseUseCase,
            useFactory: (courseRepo: CourseRepositoryPort, evalRepo: EvaluationRepository) => new AddEvaluationToCourseUseCase(courseRepo, evalRepo),
            inject: [COURSE_REPOSITORY, EVALUATION_REPOSITORY]
        },
        {
            provide: GetAllChallengesCourseUseCase,
            useFactory: (courseRepo: CourseRepositoryPort) => new GetAllChallengesCourseUseCase(courseRepo),
            inject: [COURSE_REPOSITORY]
        },
        {
            provide: GetAllUsersInCourseUseCase,
            useFactory: (courseRepo: CourseRepositoryPort) => new GetAllUsersInCourseUseCase(courseRepo),
            inject: [COURSE_REPOSITORY]
        },
        {
            provide: GetAllEvaluationsCourseUseCase,
            useFactory: (courseRepo: CourseRepositoryPort) => new GetAllEvaluationsCourseUseCase(courseRepo),
            inject: [COURSE_REPOSITORY]
        },
        {
            provide: GetCourseByNrcUseCase,
            useFactory: (courseRepo: CourseRepositoryPort) => new GetCourseByNrcUseCase(courseRepo),
            inject: [COURSE_REPOSITORY]
        },
        {
            provide: GetCourseByTitleUseCase,
            useFactory: (courseRepo: CourseRepositoryPort) => new GetCourseByTitleUseCase(courseRepo),
            inject: [COURSE_REPOSITORY]
        },
        {
            provide: ListAllCoursesUseCase,
            useFactory: (courseRepo: CourseRepositoryPort) => new ListAllCoursesUseCase(courseRepo),
            inject: [COURSE_REPOSITORY]
        } 
    ],
})
export class CoursesModule { }