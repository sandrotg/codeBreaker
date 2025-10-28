import { SubmissionRepositoryPort } from "src/domain/submissions/repositories/submission.repository.port";
import { PrismaService } from "../prisma.service";
import { Submission } from "src/domain/submissions/entities/submission.entity";

export class PrismaSubmissionsRepository implements SubmissionRepositoryPort {
    constructor(private readonly prisma: PrismaService){}

    async save(submission: Submission): Promise<Submission> {
        return 
    }

    async getById(idSubmission: string): Promise<Submission> {
        const submission = await this.prisma
    }

    async updateStatus(submission: Submission): Promise<Submission> {
        return
    }
}