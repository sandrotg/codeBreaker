import { IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";
import { CasesResult } from "src/domain/submissions/entities/casesResult.entity";
import { StatusSubmision } from "src/domain/submissions/entities/submission.entity";

export class UpdateStatusSubmissionDto {

    @IsNotEmpty()
    @IsEnum(StatusSubmision, {
        message: 'invalid status. Valid options are: Invalid status. Valid options are: QUEUED, RUNNING, ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, RUNTIME_ERROR, COMPILATION_ERROR'
    })
    status: StatusSubmision

    @IsInt()
    @IsNotEmpty()
    score: number;

    @IsInt()
    @IsNotEmpty()
    timeMsTotal: number;

    @IsNotEmpty()
    cases: CasesResult[];
}