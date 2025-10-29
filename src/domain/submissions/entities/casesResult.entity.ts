export class CasesResult {
    constructor(
        public readonly caseId: string,
        public readonly status: string,
        public readonly timeMs: number
    ) { }

}