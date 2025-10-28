export class TestCase{
    constructor(
        public readonly testCaseId: string,
        public readonly challengeId: string,
        public readonly input: string,
        public readonly output: string
    ){}
}