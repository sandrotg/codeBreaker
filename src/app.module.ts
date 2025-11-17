import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChallengeModule } from './presentation/challenges/modules/challenge.module';
import { TestCaseModule } from './presentation/challenges/modules/testCase.module';
import { AIChallengeModule } from './presentation/challenges/modules/ai-challenge.module';
import { SubmissionModule } from './presentation/submissions/submission.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ChallengeModule,
  TestCaseModule,
  AIChallengeModule,
  SubmissionModule
  ],
})
export class AppModule {}
