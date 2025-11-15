import { Job } from 'src/domain/jobs/entities/job.entity';
import { JobDto } from '../dto/job.dto';

export function toJobDto(job: Job): JobDto {
  return {
    id: job.id,
    fileKey: job.fileKey,
    inputKey: job.inputKey,
    language: job.language,
    status: job.status,
    output: job.output,
    error: job.error,
    exitCode: job.exitCode,
    executionTime: job.executionTime,
    memoryUsed: job.memoryUsed,
    createdAt: job.createdAt || new Date(),
  };
}


