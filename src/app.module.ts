import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChallengeModule } from './presentation/challenges/modules/challenge.module';
import { TestCaseModule } from './presentation/challenges/modules/testCase.module';
import { SubmissionModule } from './presentation/submissions/submission.module';
import { JobsModule } from './presentation/jobs/modules/jobs.module';
import { WorkerModule } from './worker/worker.module';
import { EvaluationModule } from './presentation/evaluations/evaluations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ChallengeModule,
  TestCaseModule,
  SubmissionModule,
  JobsModule,
  WorkerModule,
  EvaluationModule,
  ],
})
export class AppModule {}
