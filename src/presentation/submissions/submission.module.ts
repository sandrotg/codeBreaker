import { Module } from "@nestjs/common";
import { SubmissionController } from "./submission.controller";
import { PrismaService } from "src/infrastructure/prisma.service";
import { SUBMISSION_REPOSITORY } from "src/application/submissions/token";
import { PrismaSubmissionsRepository } from "src/infrastructure/submissions/prisma-submissions.repository";
import { CreateSubmissionUseCase } from "src/application/submissions/usecases/create-submission.usecase";
import { SubmissionRepositoryPort } from "src/domain/submissions/repositories/submission.repository.port";
import { UpdateStatusSubmissionUseCase } from "src/application/submissions/usecases/update-status-submission.usecase";

@Module({
    controllers: [SubmissionController],
    providers: [
        PrismaService,
        {
            provide: SUBMISSION_REPOSITORY,
            useFactory: (prisma: PrismaService) => new PrismaSubmissionsRepository(prisma),
            inject: [PrismaService]
        },
        {
            provide: CreateSubmissionUseCase,
            useFactory: (repo: SubmissionRepositoryPort) => new CreateSubmissionUseCase(repo),
            inject: [SUBMISSION_REPOSITORY]
        },
        {
            provide: UpdateStatusSubmissionUseCase,
            useFactory: (repo: SubmissionRepositoryPort) => new UpdateStatusSubmissionUseCase(repo),
            inject: [SUBMISSION_REPOSITORY]
        }
    ],
})
export class SubmissionModule { }