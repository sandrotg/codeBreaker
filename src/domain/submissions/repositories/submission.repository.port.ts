import { Submission } from "../entities/submission.entity";

export interface SubmissionRepositoryPort {
    save(submission: Submission): Promise<Submission>;
    updateStatus(submission: Submission): Promise<Submission | null>;
    getById(idSubmission: string): Promise<Submission>;
}