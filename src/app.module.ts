import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { BullModule } from '@nestjs/bull';
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
import { JwtAuthGuard } from './presentation/shared/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST') || 'localhost',
          port: configService.get('REDIS_PORT') || 6379,
        },
      }),
      inject: [ConfigService],
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
