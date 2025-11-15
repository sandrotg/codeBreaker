import { Job, JobStatus } from '../../jobs/entities/job.entity';

export interface JobsRepository {
  create(data: {
    id: string;
    fileKey: string;
    inputKey: string;
    language: string;
  }): Promise<Job>;

  findById(id: string): Promise<Job | null>;

  findAll(): Promise<Job[]>;

  updateStatus(
    id: string,
    status: JobStatus,
    result?: {
      output?: string;
      error?: string;
      exitCode?: number;
      executionTime?: number;
      memoryUsed?: number;
    },
  ): Promise<Job>;
}


