import { JobsRepository } from 'src/domain/jobs/repositories/jobs.repository.port';
import { Job } from 'src/domain/jobs/entities/job.entity';

export class GetJobUseCase {
  constructor(private readonly jobsRepo: JobsRepository) {}

  async execute(id: string): Promise<Job | null> {
    return await this.jobsRepo.findById(id);
  }
}


