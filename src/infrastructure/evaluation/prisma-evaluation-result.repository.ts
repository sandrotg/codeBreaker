import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EvaluationResultRepository } from 'src/domain/evaluations/repositories/evaluation-result.repository';
import { EvaluationResult } from 'src/domain/evaluations/entities/evaluation-result.entity';

@Injectable()
export class PrismaEvaluationResultRepository implements EvaluationResultRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(result: EvaluationResult): Promise<EvaluationResult> {
        const created = await this.prisma.evaluationResult.create({
            data: {
                resultId: result.resultId,
                evaluationId: result.evaluationId,
                userId: result.userId,
                submissionIds: result.submissionIds,
                score: result.score,
                totalChallenges: result.totalChallenges,
                startedAt: result.startedAt,
                completedAt: result.completedAt,
            },
        });

        return this.mapToDomain(created);
    }

    async update(
        resultId: string,
        submissionIds: string[],
        score: number,
        completedAt: Date,
    ): Promise<EvaluationResult> {
        const updated = await this.prisma.evaluationResult.update({
            where: { resultId },
            data: {
                submissionIds,
                score,
                completedAt,
            },
        });

        return this.mapToDomain(updated);
    }

    async findByEvaluationAndUser(
        evaluationId: string,
        userId: string,
    ): Promise<EvaluationResult | null> {
        const result = await this.prisma.evaluationResult.findUnique({
            where: {
                evaluationId_userId: {
                    evaluationId,
                    userId,
                },
            },
        });

        return result ? this.mapToDomain(result) : null;
    }

    async findByEvaluation(evaluationId: string): Promise<EvaluationResult[]> {
        const results = await this.prisma.evaluationResult.findMany({
            where: { evaluationId },
            orderBy: { completedAt: 'desc' },
        });

        return results.map(this.mapToDomain);
    }

    async findByUser(userId: string): Promise<EvaluationResult[]> {
        const results = await this.prisma.evaluationResult.findMany({
            where: { userId },
            orderBy: { startedAt: 'desc' },
        });

        return results.map(this.mapToDomain);
    }

    async delete(resultId: string): Promise<void> {
        await this.prisma.evaluationResult.delete({
            where: { resultId },
        });
    }

    private mapToDomain(prismaResult: any): EvaluationResult {
        return new EvaluationResult(
            prismaResult.resultId,
            prismaResult.evaluationId,
            prismaResult.userId,
            prismaResult.submissionIds,
            prismaResult.score,
            prismaResult.totalChallenges,
            prismaResult.startedAt,
            prismaResult.completedAt,
        );
    }
}
