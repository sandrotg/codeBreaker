import { JobsRepository } from 'src/domain/jobs/repositories/jobs.repository.port';
import { Job } from 'src/domain/jobs/entities/job.entity';

export class SubmitJobUseCase {
  constructor(
    private readonly jobsRepo: JobsRepository,
    private readonly uuidGenerator: () => string,
  ) {}

  async execute(data: { fileKey: string; inputKey: string; language: string }): Promise<Job> {
    const jobId = this.uuidGenerator();
    return await this.jobsRepo.create({
      id: jobId,
      fileKey: data.fileKey,
      inputKey: data.inputKey,
      language: data.language,
    });
  }
}


