import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Language, StatusSubmission } from "src/domain/submissions/entities/submission.entity";


export class CreateSubmissionDto {

    @IsString()
    @IsNotEmpty()
    user: string;

    @IsString()
    @IsNotEmpty()
    challengeId: string;

    @IsEnum(Language, {
        message: 'invalid lenguage. Valid options are: Python, C++, Java, Node.js'
    })
    @IsNotEmpty()
    lenguage: Language;

    @IsEnum(StatusSubmission, {
        message: 'invalid status. Valid options are: Invalid status. Valid options are: QUEUED, RUNNING, ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, RUNTIME_ERROR, COMPILATION_ERROR'
    })
    @IsNotEmpty()
    status: StatusSubmission;
}