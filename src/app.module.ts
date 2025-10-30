import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChallengeModule } from './presentation/challenges/modules/challenge.module';
import { TestCaseModule } from './presentation/challenges/modules/testCase.module';
import { SubmissionModule } from './presentation/submissions/submission.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ChallengeModule,
  TestCaseModule,
  SubmissionModule
  ],
})
export class AppModule {}
