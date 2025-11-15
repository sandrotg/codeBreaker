export type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export class Job {
  constructor(
    public readonly id: string,
    public readonly fileKey: string,
    public readonly inputKey: string,
    public readonly language: string,
    public readonly status: JobStatus,
    public readonly output?: string,
    public readonly error?: string,
    public readonly exitCode?: number,
    public readonly executionTime?: number,
    public readonly memoryUsed?: number,
    public readonly createdAt?: Date,
  ) {}
}


