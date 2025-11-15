// ...existing code...
import { IsEnum, IsInt, IsNotEmpty } from "class-validator";
import { CasesResult } from "src/domain/submissions/entities/casesResult.entity";
import { StatusSubmission } from "src/domain/submissions/entities/submission.entity";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateStatusSubmissionDto {

    @ApiProperty({
        enum: StatusSubmission,
        description: 'Status. Valid options: QUEUED, RUNNING, ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, RUNTIME_ERROR, COMPILATION_ERROR',
        example: StatusSubmission.ACCEPTED
    })
    @IsNotEmpty()
    @IsEnum(StatusSubmission, {
        message: 'invalid status. Valid options are: QUEUED, RUNNING, ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, RUNTIME_ERROR, COMPILATION_ERROR'
    })
    status: StatusSubmission

    @ApiProperty({ example: 100, description: 'Score obtained' })
    @IsInt()
    @IsNotEmpty()
    score?: number;

    @ApiProperty({ example: 1234, description: 'Total time in milliseconds' })
    @IsInt()
    @IsNotEmpty()
    timeMsTotal?: number;

    @ApiProperty({
        type: () => CasesResult,
        isArray: true,
        required: false,
        description: 'Results for each test case (optional)',
        example: [
            { caseId: 'case-1', status: 'PASSED', timeMs: 120 },
            { caseId: 'case-2', status: 'FAILED', timeMs: 300 }
        ]
    })
    cases?: CasesResult[];
}