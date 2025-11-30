export enum EvaluationState {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive'
}

export class Evaluation {
    constructor(
        public readonly evaluationId: string,
        public readonly name: string,
        public readonly startAt: Date,
        public readonly duration: number,
        public readonly state: EvaluationState = EvaluationState.INACTIVE,
        public readonly createdAt: Date = new Date(),
    ){}
}