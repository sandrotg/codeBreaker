import { Submission } from "src/domain/submissions/entities/submission.entity";
import { SubmissionRepositoryPort } from "src/domain/submissions/repositories/submission.repository.port";

export class FindAllSubmissionsUsecase {
    constructor(private submissionRepository: SubmissionRepositoryPort) {}
    async execute(): Promise<Submission[]> {
        return this.submissionRepository.findAll();
    }
}