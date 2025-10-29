import { SubmissionRepositoryPort } from "src/domain/submissions/repositories/submission.repository.port";
import { PrismaService } from "../prisma.service";
import { Submission } from "src/domain/submissions/entities/submission.entity";

export class PrismaSubmissionsRepository{
    constructor(private readonly prisma: PrismaService){}

}