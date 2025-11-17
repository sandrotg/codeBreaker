import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobsController } from '../controllers/jobs.controller';
import { UploadController } from '../controllers/upload.controller';
import { PrismaService } from 'src/infrastructure/prisma.service';
import { PrismaJobsRepository } from 'src/infrastructure/jobs/prisma-jobs.repository';
import { JOBS_REPOSITORY } from 'src/application/tokens';
import { JobsRepository } from 'src/domain/jobs/repositories/jobs.repository.port';
import { SubmitJobUseCase } from 'src/application/jobs/use-cases/submit-job.usecase';
import { GetJobUseCase } from 'src/application/jobs/use-cases/get-job.usecase';
import { ListJobsUseCase } from 'src/application/jobs/use-cases/list-jobs.usecase';
import { MinioService } from 'src/infrastructure/minio/minio.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'code-execution' }),
  ],
  controllers: [JobsController, UploadController],
  providers: [
    PrismaService,
    MinioService,
    {
      provide: JOBS_REPOSITORY,
      useFactory: (prisma: PrismaService): JobsRepository => new PrismaJobsRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: SubmitJobUseCase,
      useFactory: (repo: JobsRepository) => new SubmitJobUseCase(repo, () => crypto.randomUUID()),
      inject: [JOBS_REPOSITORY],
    },
    {
      provide: GetJobUseCase,
      useFactory: (repo: JobsRepository) => new GetJobUseCase(repo),
      inject: [JOBS_REPOSITORY],
    },
    {
      provide: ListJobsUseCase,
      useFactory: (repo: JobsRepository) => new ListJobsUseCase(repo),
      inject: [JOBS_REPOSITORY],
    },
  ],
})
export class JobsModule {}


