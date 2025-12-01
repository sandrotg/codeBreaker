import { Submission } from "../entities/submission.entity";

export interface SubmissionRepositoryPort {
    save(submission: Submission): Promise<Submission>;
    updateStatus(submission: Submission): Promise<Submission>;
    getById(idSubmission: string): Promise<Submission | null>;
    findAll(): Promise<Submission[]>;
}