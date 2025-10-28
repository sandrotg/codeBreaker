import { CasesResult } from "./casesResult.entity";

export class Submission {
    constructor(
        public readonly submissionId: string,
        public readonly user: string,
        public readonly challengeId: string,
        public readonly language: Language,
        public readonly status: StatusSubmission,
        public readonly createdAt: Date, 
        public readonly score?: number,
        public readonly timeMsTotal?: number,
        public readonly cases?: CasesResult[]
    ){}
}

export enum Language {
    Python = "Python",
    CPlusPlus = "C++",
    Java = "Java",
    Node = "Node.js",
}

export enum StatusSubmission{
    QUEUED = "QUEUED",
    RUNNING = "RUNNING",
    ACCEPTED = "ACCEPTED",
    WA = "WRONG_ANSWER",
    TLE = "TIME_LIMIT_EXCEEDED",
    RE = "RUNTIME_ERROR",
    CE = "COMPILATION_ERROR"
}