import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { EvaluationRepository } from "src/domain/evaluations/repositories/evaluation.repository";
import { Evaluation, EvaluationState } from "src/domain/evaluations/entities/evaluation.entity";
import { Challenge, Difficulty, State } from "src/domain/challenges/entities/challenges.entity";

@Injectable()
export class PrismaEvaluationRepository implements EvaluationRepository {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    private mapToDomain(prismaEvaluation: any): Evaluation {
        return new Evaluation(
            prismaEvaluation.evaluationId,
            prismaEvaluation.name,
            prismaEvaluation.startAt,
            prismaEvaluation.duration,
            prismaEvaluation.state === 'Active' ? EvaluationState.ACTIVE : EvaluationState.INACTIVE,
            prismaEvaluation.createdAt
        );
    }

    private mapToPrisma(state: EvaluationState): 'Active' | 'Inactive' {
        return state === EvaluationState.ACTIVE ? 'Active' : 'Inactive';
    }

    async save(evaluation: Evaluation): Promise<Evaluation> {
        const createdEvaluation = await this.prisma.evaluation.create({
            data: {
                evaluationId: evaluation.evaluationId,
                name: evaluation.name,
                startAt: evaluation.startAt,
                duration: evaluation.duration,
                state: this.mapToPrisma(evaluation.state),
                createdAt: evaluation.createdAt
            }
        });
        return this.mapToDomain(createdEvaluation);
    }

    async findEvaluationById(evaluationId: string): Promise<Evaluation | null> {
        const evaluation = await this.prisma.evaluation.findUnique({
            where: { evaluationId: evaluationId }
        });
        return evaluation ? this.mapToDomain(evaluation) : null;
    }

    async delete(evaluation: Evaluation): Promise<Evaluation> {
        const deletedEvaluation = await this.prisma.evaluation.delete({
            where: { evaluationId: evaluation.evaluationId }
        });
        return this.mapToDomain(deletedEvaluation);
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

    async assignCourses(evaluationId: string, courseIds: string[]): Promise<void> {
        const rows = courseIds.map((courseId) => ({
            evaluationId: evaluationId,
            courseId: courseId,
        }));
        await this.prisma.evaluationCourse.createMany({
            data: rows,
            skipDuplicates: true,
        });
    }

    async findAllEvaluations(): Promise<Evaluation[]> {
        const evaluations = await this.prisma.evaluation.findMany();
        return evaluations.map(e => this.mapToDomain(e));
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
    async updateState(evaluationId: string, state: EvaluationState): Promise<void> {
        await this.prisma.evaluation.update({
            where: { evaluationId },
            data: { state: this.mapToPrisma(state) }
        });
    }

    async findActiveEvaluationsByStudent(userId: string): Promise<Evaluation[]> {
        const evaluations = await this.prisma.evaluation.findMany({
            where: {
                state: 'Active',
                courses: {
                    some: {
                        course: {
                            users: {
                                some: {
                                    userId: userId
                                }
                            }
                        }
                    }
                }
            }
        });
        return evaluations.map(e => this.mapToDomain(e));
    }
}