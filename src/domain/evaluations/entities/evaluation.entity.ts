export class Evaluation {
    constructor(
        public readonly evaluationId: string,
        public readonly name: string,
        public readonly date: string,
        public readonly duration: number,
    ){}
}