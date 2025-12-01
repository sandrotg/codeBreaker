import { Controller, Post, Body, Get, Param, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { SubmitJobDto } from 'src/application/jobs/dto/job.dto';
import { SubmitJobUseCase } from 'src/application/jobs/use-cases/submit-job.usecase';
import { GetJobUseCase } from 'src/application/jobs/use-cases/get-job.usecase';
import { ListJobsUseCase } from 'src/application/jobs/use-cases/list-jobs.usecase';
import { toJobDto } from 'src/application/jobs/mappers/job.mapper';
import { ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/presentation/shared/decorators/public.decorator';

@Public()
@Controller('jobs')
export class JobsController {
  constructor(
    private readonly submitJob: SubmitJobUseCase,
    private readonly getJob: GetJobUseCase,
    private readonly listJobs: ListJobsUseCase,
    @InjectQueue('code-execution') private readonly codeQueue: Queue,
  ) {}

  @Post('submit')
  async submit(@Body() dto: SubmitJobDto) {
    try {

      const job = await this.submitJob.execute({ fileKey: dto.fileKey, inputKey: dto.inputKey, language: dto.language.toLowerCase() });

      await this.codeQueue.add(
        { jobId: job.id, fileKey: job.fileKey, inputKey: job.inputKey, language: job.language },
        { jobId: job.id, removeOnComplete: false, removeOnFail: false, attempts: 3, backoff: { type: 'exponential', delay: 2000 } },
      );

      return { success: true, data: toJobDto(job) };
    } catch (error: any) {
      throw new HttpException(error.message || 'Failed to submit job', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job by ID', description: 'Retrieves a specific job by its ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the job',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  async get(@Param('id') id: string) {
    const job = await this.getJob.execute(id);
    if (!job) throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    return { success: true, data: toJobDto(job) };
  }

  @Get()
  async list() {
    const jobs = await this.listJobs.execute();
    return { success: true, data: jobs.map(toJobDto) };
  }
}


