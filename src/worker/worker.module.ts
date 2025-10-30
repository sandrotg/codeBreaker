import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { WorkerProcessor } from './worker.processor';
import { MinioService } from 'src/infrastructure/minio/minio.service';
import { PrismaService } from 'src/infrastructure/prisma.service';
import { JOBS_REPOSITORY } from 'src/application/tokens';
import { PrismaJobsRepository } from 'src/infrastructure/jobs/prisma-jobs.repository';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'code-execution' }),
  ],
  providers: [
    WorkerProcessor,
    MinioService,
    PrismaService,
    {
      provide: JOBS_REPOSITORY,
      useFactory: (prisma: PrismaService) => new PrismaJobsRepository(prisma),
      inject: [PrismaService],
    },
  ],
})
export class WorkerModule {}


