import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChallengeModule } from './presentation/challenges/modules/challenge.module';
import { TestCaseModule } from './presentation/challenges/modules/testCase.module';
import { AIChallengeModule } from './presentation/challenges/modules/ai-challenge.module';
import { SubmissionModule } from './presentation/submissions/submission.module';
import { JobsModule } from './presentation/jobs/modules/jobs.module';
import { WorkerModule } from './worker/worker.module';
import { UsersModule } from './presentation/users/modules/users.module';
import { EvaluationModule } from './presentation/evaluations/evaluations.module';
import { RolesModule } from './presentation/users/modules/roles.module';
import { CoursesModule } from './presentation/courses/modules/courses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ChallengeModule,
  TestCaseModule,
  AIChallengeModule,
  SubmissionModule,
  JobsModule,
  WorkerModule,
  UsersModule,
  RolesModule,
  EvaluationModule,
  CoursesModule
  ],
})
export class AppModule {}
