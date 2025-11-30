export class EvaluationResult {
    constructor(
        public readonly resultId: string,
        public readonly evaluationId: string,
        public readonly userId: string,
        public submissionIds: string[],
        public score: number | null,
        public readonly totalChallenges: number,
        public readonly startedAt: Date,
        public completedAt: Date | null,
    ) {}
}
