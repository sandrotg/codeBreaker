export class CasesResult {
    constructor(
        private readonly caseId: string,
        private readonly status: string,
        private readonly timeMs: number
    ) { }

}