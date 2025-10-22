import { TestCase } from "./testcase.entity";

export class Challenge{
    constructor(
        public readonly challengeId: number | null,
        public readonly title: string,
        public readonly description: string,
        public readonly difficulty: 'easy' | 'Medium' | 'Hard',
        public readonly tags: string[],
        public readonly timeLimit: number,
        public readonly memoryLimit: number,
        public readonly status:  'draft' | 'published' | 'archived',
        public readonly authorId: number | null,
        public readonly createdAt: Date,
        public readonly testCases: TestCase[] = []


    ){}
}