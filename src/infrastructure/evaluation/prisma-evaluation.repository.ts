import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { EvaluationRepository } from "src/domain/evaluations/repositories/evaluation.repository";
import { Evaluation } from "src/domain/evaluations/entities/evaluation.entity";
import { Challenge, Difficulty, State } from "src/domain/challenges/entities/challenges.entity";

@Injectable()
export class PrismaEvaluationRepository implements EvaluationRepository {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async save(evaluation: Evaluation): Promise<Evaluation> {
        const createdEvaluation = await this.prisma.evaluation.create({
            data: evaluation
        });
        return createdEvaluation;
    }

    async findEvaluationById(evaluationId: string): Promise<Evaluation | null> {
        const evaluation = await this.prisma.evaluation.findUnique({
            where: { evaluationId: evaluationId }
        });
        return evaluation;
    }

    async delete(evaluation: Evaluation): Promise<Evaluation> {
        const deletedEvaluation = await this.prisma.evaluation.delete({
            where: { evaluationId: evaluation.evaluationId }
        });
        return deletedEvaluation;
    }

    async assignChallenges(evaluationId: string, challengeIds: string[]): Promise<void> {
        const rows = challengeIds.map((challengeId) => ({
            evaluationId: evaluationId,
            challengeId: challengeId,
        }));
        await this.prisma.evaluationChallenge.createMany({
            data: rows,
            skipDuplicates: true,
        });
    }

    async findAllEvaluations(): Promise<Evaluation[]> {
        return this.prisma.evaluation.findMany();
    }
    
    async getChallengesInEvaluation(evaluationId: string): Promise<Challenge[]> {
        const evaluations = await this.prisma.evaluationChallenge.findMany({
            where: { evaluationId: evaluationId },
            include: {
                challenge: true
            }
        });
        return evaluations.map(ev => new Challenge(
            ev.challenge.challengeId,
            ev.challenge.title,
            ev.challenge.difficulty as unknown as Difficulty,
            ev.challenge.tags,
            ev.challenge.timeLimit,
            ev.challenge.memoryLimit,
            ev.challenge.description,
            ev.challenge.state as unknown as State,
        ));
    }
}