import { SubmissionRepositoryPort } from "src/domain/submissions/repositories/submission.repository.port";
import { PrismaService } from "../prisma.service";
import { Submission } from "src/domain/submissions/entities/submission.entity";
import { mapLanguageFromPrisma, mapLanguageToPrisma, mapStatusFromPrisma, mapStatusToPrisma } from "../mappers/submissions.mapper";
import { map } from "rxjs";
import { CasesResult } from "src/domain/submissions/entities/casesResult.entity";

export class PrismaSubmissionsRepository implements SubmissionRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async save(submission: Submission): Promise<Submission> {
        const saved = await this.prisma.submission.create({
            data: {
                submissionId: submission.submissionId,
                user: submission.user,
                challengeId: submission.challengeId,
                language: mapLanguageToPrisma(submission.language),
                status: mapStatusToPrisma(submission.status),
                createdAt: submission.createdAt,
            }
        });
        return new Submission(
            saved.submissionId,
            saved.user,
            saved.challengeId,
            mapLanguageFromPrisma(saved.language),
            mapStatusFromPrisma(saved.status),
            saved.createdAt
        )
    }

    async getById(idSubmission: string): Promise<Submission | null> {
        const submission = await this.prisma.submission.findUnique({
            where: { submissionId: idSubmission },
            include: {
                cases: true
            }
        });
        if (!submission) return null;
        return new Submission(
            submission.submissionId,
            submission.user,
            submission.challengeId,
            mapLanguageFromPrisma(submission.language),
            mapStatusFromPrisma(submission.status),
            submission.createdAt,
            submission.score ?? undefined,
            submission.timeMsTotal ?? undefined,
            submission.cases.map(m => new CasesResult(m.caseId, m.status, m.timeMs))
        )
    }

    async updateStatus(submission: Submission): Promise<Submission> {
        const updated = await this.prisma.submission.update({
            where: { submissionId: submission.submissionId },
            data: {
                status: mapStatusToPrisma(submission.status),
                score: submission.score,
                timeMsTotal: submission.timeMsTotal,
                cases: {
                    upsert: submission.cases?.map(c => ({
                        where: { caseId: c.caseId },
                        update: {
                            status: c.status,
                            timeMs: c.timeMs,
                        },
                        create: {
                            caseId: c.caseId,
                            status: c.status,
                            timeMs: c.timeMs,
                        },
                    })),
                }
            },
            include: { cases: true, }
        });
        return new Submission(
            updated.submissionId,
            updated.user,
            updated.challengeId,
            mapLanguageFromPrisma(updated.language),
            mapStatusFromPrisma(updated.status),
            updated.createdAt,
            updated.score ?? undefined,
            updated.timeMsTotal ?? undefined,
            updated.cases.map(m => new CasesResult(m.caseId, m.status, m.timeMs))
        )
    }
}