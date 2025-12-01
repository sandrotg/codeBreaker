import { Body, Controller, Param, Post, Put } from "@nestjs/common";
import { CreateSubmissionDto } from "src/application/submissions/dto/create-submission.dto";
import { UpdateStatusSubmissionDto } from "src/application/submissions/dto/update-status-submission.dto";
import { CreateSubmissionUseCase } from "src/application/submissions/usecases/create-submission.usecase";
import { UpdateStatusSubmissionUseCase } from "src/application/submissions/usecases/update-status-submission.usecase";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags('submissions')
@ApiBearerAuth('bearer')
@Controller('submissions')
export class SubmissionController{
    constructor(
        private readonly updateStatusSubmissionUC: UpdateStatusSubmissionUseCase,
        private readonly createSubmissionUC: CreateSubmissionUseCase,
    ){}

    @Post()
    @ApiOperation({ summary: 'Create a submission' })
    @ApiResponse({ status: 201, description: 'Submission created successfully.' })
    @ApiResponse({ status: 400, description: 'Validation error.' })
    @ApiBody({ type: CreateSubmissionDto })
    async createSubmission(@Body() body: CreateSubmissionDto){
        return await this.createSubmissionUC.execute(body);
    }

    @Put(':submissionId/status')
    @ApiOperation({ summary: 'Update submission status' })
    @ApiParam({ name: 'submissionId', description: 'Submission id' })
    @ApiResponse({ status: 200, description: 'Submission updated successfully.' })
    @ApiResponse({ status: 404, description: 'Submission not found.' })
    @ApiBody({ type: UpdateStatusSubmissionDto })
    async updateStatusSubmission(@Param('submissionId') submissionId: string, @Body() body: UpdateStatusSubmissionDto){
        return await this.updateStatusSubmissionUC.execute(submissionId, body);
    }
}