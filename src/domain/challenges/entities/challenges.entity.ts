export class Challenge {
    constructor(
        public readonly challengeId: string,
        public readonly title: string,
        public readonly difficulty: Difficulty,
        public readonly tags: string[],
        public readonly timeLimit: number,
        public readonly memoryLimit: number,
        public readonly description: string,
        public readonly state: State
    ){}
}

export enum Difficulty {
    EASY =  'Easy',
    MEDIUM = 'Medium',
    HARD = 'Hard'
}

export enum State {
    DRAFT =  'Draft',
    PUBLISHED = 'Published',
    ARCHIVED = 'Archived'
}