import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './infrastructure/prisma.service';
import { SubmissionModule } from './presentation/submissions/submission.module';

@Module({
  imports: [SubmissionModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
