import { Submission } from "src/domain/submissions/entities/submission.entity";
import { SubmissionRepositoryPort } from "src/domain/submissions/repositories/submission.repository.port";
import { CreateSubmissionDto } from "../dto/create-submission.dto";
import { randomUUID } from "crypto";
import { NotFoundException } from "@nestjs/common";

export class CreateSubmissionUseCase {
    constructor(private readonly submissionPort: SubmissionRepositoryPort,) { }

    async execute(input: CreateSubmissionDto): Promise<Submission> {
        //const challenge = await this.challengePort.getById(input.challengeId);
        //if (!challenge) throw new NotFoundException("challenge not found")
        const submission = new Submission(
            randomUUID(),
            input.user,
            input.challengeId,
            input.lenguage,
            input.status,
            new Date()
        )
        return await this.submissionPort.save(submission);
    }
}