import { JobsRepository } from 'src/domain/jobs/repositories/jobs.repository.port';
import { Job } from 'src/domain/jobs/entities/job.entity';

export class ListJobsUseCase {
  constructor(private readonly jobsRepo: JobsRepository) {}

  async execute(): Promise<Job[]> {
    return await this.jobsRepo.findAll();
  }
}


