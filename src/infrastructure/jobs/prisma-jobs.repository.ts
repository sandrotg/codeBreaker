import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JobsRepository } from 'src/domain/jobs/repositories/jobs.repository.port';
import { Job, JobStatus } from 'src/domain/jobs/entities/job.entity';

@Injectable()
export class PrismaJobsRepository implements JobsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { id: string; fileKey: string; inputKey: string; language: string }): Promise<Job> {
    const job = await this.prisma.job.create({
      data: {
        id: data.id,
        fileKey: data.fileKey,
        inputKey: data.inputKey,
        language: data.language,
        status: 'QUEUED',
      },
    });

    return this.map(job);
  }

  async findById(id: string): Promise<Job | null> {
    const job = await this.prisma.job.findUnique({ where: { id } });
    return job ? this.map(job) : null;
  }

  async findAll(): Promise<Job[]> {
    const jobs = await this.prisma.job.findMany({ orderBy: { createdAt: 'desc' } });
    return jobs.map((j) => this.map(j));
  }

  async updateStatus(
    id: string,
    status: JobStatus,
    result?: { output?: string; error?: string; exitCode?: number; executionTime?: number; memoryUsed?: number },
  ): Promise<Job> {
    const job = await this.prisma.job.update({
      where: { id },
      data: {
        status,
        output: result?.output,
        error: result?.error,
        exitCode: result?.exitCode,
        executionTime: result?.executionTime,
        memoryUsed: result?.memoryUsed,
      },
    });
    return this.map(job);
  }

  private map(j: any): Job {
    return new Job(
      j.id,
      j.fileKey,
      j.inputKey,
      j.language,
      j.status as JobStatus,
      j.output ?? undefined,
      j.error ?? undefined,
      j.exitCode ?? undefined,
      j.executionTime ?? undefined,
      j.memoryUsed ?? undefined,
      j.createdAt ?? undefined,
    );
  }
}


