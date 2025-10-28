import { CasesResult } from "./casesResult.entity";

export class Submission {
    constructor(
        public readonly idSubmission: string,
        public readonly user: string,
        public readonly challengeId: string,
        public readonly lenguage: Lenguage,
        public readonly status: StatusSubmision,
        public readonly createdAt: Date, 
        public readonly score?: number,
        public readonly timeMsTotal?: number,
        public readonly cases?: CasesResult[]
    ){}
}

export enum Lenguage {
    Python = "Python",
    CPlusPlus = "C++",
    Java = "Java",
    Node = "Node.js",
}

export enum StatusSubmision{
    QUEUED = "QUEUED",
    RUNNING = "RUNNING",
    ACCEPTED = "ACCEPTED",
    WA = "WRONG_ANSWER",
    TLE = "TIME_LIMIT_EXCEEDED",
    RE = "RUNTIME_ERROR",
    CE = "COMPILATION_ERROR"
}