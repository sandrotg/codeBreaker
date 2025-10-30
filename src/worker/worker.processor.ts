import { Processor, Process } from '@nestjs/bull';
import type { Job as BullJob } from 'bull';
import { Inject } from '@nestjs/common';
import { DockerRunnerService } from 'src/infrastructure/docker/docker-runner.service';
import { MinioService } from 'src/infrastructure/minio/minio.service';
import { JOBS_REPOSITORY } from 'src/application/tokens';
import type { JobsRepository } from 'src/domain/jobs/repositories/jobs.repository.port';

interface CodeExecutionJob {
  jobId: string;
  fileKey: string;
  language: string;
  inputKey: string;
}

@Processor('code-execution')
export class WorkerProcessor {
  constructor(
    private readonly dockerRunner: DockerRunnerService,
    private readonly minio: MinioService,
    @Inject(JOBS_REPOSITORY) private readonly jobsRepo: JobsRepository,
  ) {}

  @Process()
  async handleCodeExecution(job: BullJob<CodeExecutionJob>) {
    const { jobId, fileKey, language, inputKey } = job.data;
    try {
      await this.jobsRepo.updateStatus(jobId, 'PROCESSING');

      const codeBuffer = await this.minio.downloadCodeFile(fileKey);
      const inputBuffer = await this.minio.downloadInputFile(inputKey);
      const inputData = inputBuffer.toString('utf-8');
      const fileName = fileKey.split('/').pop() as string;

      const result = await this.dockerRunner.run(language, codeBuffer, fileName, inputData);

      await this.jobsRepo.updateStatus(jobId, result.exitCode === 0 ? 'COMPLETED' : 'FAILED', {
        output: result.output,
        error: result.error,
        exitCode: result.exitCode,
        executionTime: result.executionTime,
        memoryUsed: result.memoryUsed,
      });

      const executionResult = {
        jobId,
        status: result.exitCode === 0 ? 'success' : 'error',
        output: result.output,
        error: result.error,
        exitCode: result.exitCode,
        executionTime: result.executionTime,
        memoryUsed: result.memoryUsed,
        language,
        timestamp: Date.now(),
      };
      await this.minio.uploadResult(jobId, executionResult);

      return executionResult;
    } catch (error: any) {
      await this.jobsRepo.updateStatus(jobId, 'FAILED', {
        error: error.message || 'Unknown error',
      });
      throw error;
    }
  }
}


