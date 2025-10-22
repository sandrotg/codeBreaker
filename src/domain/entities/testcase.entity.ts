export class TestCase {
    constructor(
        public readonly testCaseId: number | null,
        public readonly challengeId: number,
        public readonly input: string,
        public readonly expectedOutput:string,
        public readonly IsHidden:boolean,
        public readonly createdAt:Date
    ){}
}