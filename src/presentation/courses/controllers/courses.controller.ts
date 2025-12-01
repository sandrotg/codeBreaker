import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { createCourseDto } from "src/application/courses/dto/create-course.dto";
import { AddChanllengeToCourseUseCase } from "src/application/courses/usecases/add-challenge-course.usecase";
import { AddEvaluationToCourseUseCase } from "src/application/courses/usecases/add-evaluation-course.usecase";
import { AddUserToCourseUseCase } from "src/application/courses/usecases/add-users-course.usecase";
import { createCourseUsecase } from "src/application/courses/usecases/create-course.usecase";
import { GetAllChallengesCourseUseCase } from "src/application/courses/usecases/get-all-challenges.usecase";
import { GetAllEvaluationsCourseUseCase } from "src/application/courses/usecases/get-all-evaluations.usecase";
import { GetAllUsersInCourseUseCase } from "src/application/courses/usecases/get-all-users.usecase";
import { GetCourseByNrcUseCase } from "src/application/courses/usecases/get-by-nrc-course.usecase";
import { GetCourseByTitleUseCase } from "src/application/courses/usecases/get-by-title-course.usecase";
import { ListAllCoursesUseCase } from "src/application/courses/usecases/list-all-courses.usecase";

@ApiTags('courses')
@ApiBearerAuth('bearer')
@Controller('courses')
export class CoursesController {
    constructor(
        private readonly createCourseUC: createCourseUsecase,
        private readonly addUsersCourseUC: AddUserToCourseUseCase,
        private readonly addChallengesCourseUC: AddChanllengeToCourseUseCase,
        private readonly addEvaluationsCourseUC: AddEvaluationToCourseUseCase,
        private readonly getAllChallengesCourseUC: GetAllChallengesCourseUseCase,
        private readonly getAllUsersCourseUC: GetAllUsersInCourseUseCase,
        private readonly getAllEvaluationCourseUC: GetAllEvaluationsCourseUseCase,
        private readonly getByNrcUC: GetCourseByNrcUseCase,
        private readonly getByTitleUC: GetCourseByTitleUseCase,
        private readonly listAllCoursesUC: ListAllCoursesUseCase,
    ){}

    @Post('create')
    @ApiOperation({ summary: 'Create a new course' })
    @ApiResponse({ status: 201, description: 'Course created successfully.' })
    @ApiResponse({ status: 400, description: 'Validation error.' })
    @ApiBody({ type: createCourseDto })
    async createCourse(@Body() body: createCourseDto){
        return await this.createCourseUC.execute(body);
    }

    @Post('add-users/:nrc')
    @ApiOperation({ summary: 'Add users to a course' })
    @ApiParam({ name: 'nrc', description: 'Course NRC', type: 'number' })
    @ApiBody({ schema: { example: { userEmails: ['user1@mail.com', 'user2@mail.com'] } } })
    @ApiResponse({ status: 200, description: 'Users added successfully.' })
    @ApiResponse({ status: 404, description: 'Course or user not found.' })
    @ApiResponse({ status: 409, description: 'User already in course.' })
    async addUsersToCourse(@Param('nrc', ParseIntPipe) nrc: number, @Body() body: {userEmails: string[]} ){
        return await this.addUsersCourseUC.execute(nrc, body.userEmails);
    }

    @Post('add-challenges/:nrc/:challengeId')
    @ApiOperation({ summary: 'Add a challenge to a course' })
    @ApiParam({ name: 'nrc', description: 'Course NRC', type: 'number' })
    @ApiParam({ name: 'challengeId', description: 'Challenge identifier' })
    @ApiResponse({ status: 200, description: 'Challenge added successfully.' })
    @ApiResponse({ status: 404, description: 'Course or challenge not found.' })
    async addChallengesToCourse(@Param('nrc', ParseIntPipe) nrc: number, @Param('challengeId') challengeId: string){
        return await this.addChallengesCourseUC.execute(nrc, challengeId);
    }

    @Get('challenges/:nrc')
    @ApiOperation({ summary: 'Get all challenges in a course' })
    @ApiParam({ name: 'nrc', description: 'Course NRC', type: 'number' })
    @ApiResponse({ status: 200, description: 'List of challenges retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Course not found.' })
    async getAllChalengesInCourse(@Param('nrc',ParseIntPipe) nrc: number){
        return await this.getAllChallengesCourseUC.execute(nrc);
    }

    @Post('add-evaluations/:nrc/:evaluationId')
    @ApiOperation({ summary: 'Add an evaluation to  a Course' })
    @ApiParam({ name: 'nrc', description: 'Course NRC', type: 'number' })
    @ApiParam({ name: 'evaluationId', description: 'Evaluation identifier' })
    @ApiResponse({ status: 200, description: 'Evaluation added successfully.' })
    @ApiResponse({ status: 404, description: 'Course or evaluation not found.' })
    async addEvaluationToCourse(@Param('nrc', ParseIntPipe) nrc: number, @Param('evaluationId') evaluationId: string){
        return await this.addEvaluationsCourseUC.execute(nrc, evaluationId);
    }

    @Get('evaluations/:nrc')
    @ApiOperation({ summary: 'Get all evaluations in a course' })
    @ApiParam({ name: 'nrc', description: 'Course NRC', type: 'number' })
    @ApiResponse({ status: 200, description: 'List of evaluations retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Course not found.' })
    async getAllEvaluationsInCourse(@Param('nrc',ParseIntPipe) nrc: number){
        return await this.getAllEvaluationCourseUC.execute(nrc);
    }

    @Get('users/:nrc')
    @ApiOperation({ summary: 'Get all users in a course' })
    @ApiParam({ name: 'nrc', description: 'Course NRC', type: 'number' })
    @ApiResponse({ status: 200, description: 'List of users retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Course not found.' })
    async getAllUsersInCourse(@Param('nrc',ParseIntPipe) nrc: number){
        return await this.getAllUsersCourseUC.execute(nrc);
    }

    @Get(':nrc')
    @ApiOperation({ summary: 'Get course by NRC' })
    @ApiParam({ name: 'nrc', description: 'Course NRC', type: 'number' })
    @ApiResponse({ status: 200, description: 'Course retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Course not found.' })
    async getCourseByNrc(@Param('nrc',ParseIntPipe) nrc: number){
        return await this.getByNrcUC.execute(nrc);
    }

    @Get(':title')
    @ApiOperation({ summary: 'Get courses by title (partial match, case-insensitive)' })
    @ApiParam({ name: 'title', description: 'Course title or partial title' })
    @ApiResponse({ status: 200, description: 'Courses retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'No courses found.' })
    async getCourseByTitle(@Param('title') title: string){
        return await this.getByTitleUC.execute(title);
    }

    @Get('/')
    @ApiOperation({ summary: 'List all courses' })
    @ApiResponse({ status: 200, description: 'Courses retrieved successfully.' })
    async listAllCourses(){
        return await this.listAllCoursesUC.execute();
    }
}