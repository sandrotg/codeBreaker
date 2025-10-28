import { SubmissionRepositoryPort } from "src/domain/submissions/repositories/submission.repository.port";
import { UpdateStatusSubmissionDto } from "../dto/update-status-submission.dto";
import { Submission } from "src/domain/submissions/entities/submission.entity";
import { NotFoundException } from "@nestjs/common";

export class UpcateStatusSubmissionUseCase {
    constructor(private readonly submissionPort: SubmissionRepositoryPort){}

    async execute(idSubmission: string, input: UpdateStatusSubmissionDto): Promise<Submission>{
        const checkSubmission = await this.submissionPort.getById(idSubmission);
        if(!checkSubmission)throw new NotFoundException("submission not found")
        const newSubmission = new Submission(
            checkSubmission.submissionId,
            checkSubmission.user,
            checkSubmission.challengeId,
            checkSubmission.language,
            input.status,
            checkSubmission.createdAt,
            input.score,
            input.timeMsTotal,
            input.cases
        );
        return await this.submissionPort.updateStatus(newSubmission)
    }
}