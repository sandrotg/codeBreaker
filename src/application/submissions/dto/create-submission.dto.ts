import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Lenguage, StatusSubmision } from "src/domain/submissions/entities/submission.entity";


export class CreateSubmissionDto {

    @IsString()
    @IsNotEmpty()
    user: string;

    @IsString()
    @IsNotEmpty()
    challengeId: string;

    @IsEnum(Lenguage, {
        message: 'invalid lenguage. Valid options are: Python, C++, Java, Node.js'
    })
    @IsNotEmpty()
    lenguage: Lenguage;

    @IsEnum(StatusSubmision, {
        message: 'invalid status. Valid options are: Invalid status. Valid options are: QUEUED, RUNNING, ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, RUNTIME_ERROR, COMPILATION_ERROR'
    })
    @IsNotEmpty()
    status: StatusSubmision;
}