import { Submission } from "src/domain/submissions/entities/submission.entity";
import { SubmissionRepositoryPort } from "src/domain/submissions/repositories/submission.repository.port";
import { CreateSubmissionDto } from "../dto/create-submission.dto";
import { randomUUID } from "crypto";

export class CreateSubmissionUseCase {
    constructor(private readonly submissionPort: SubmissionRepositoryPort, private readonly challengePort: ChallengeRepositoryPort) { }

    async execute(input: CreateSubmissionDto): Promise<Submission> {
        const challenge = await this.challengePort.getById(input.challengeId);
        if (!challenge) throw new Error("challenge not found")
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