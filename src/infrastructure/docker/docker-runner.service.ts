import { Injectable } from '@nestjs/common';
import Docker from 'dockerode';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';

export interface RunnerResult {
  output: string;
  error: string;
  exitCode: number;
  executionTime: number;
  memoryUsed: number;
}

@Injectable()
export class DockerRunnerService {
  private docker: Docker;

  constructor() {
    // Prefer Unix socket if available (common in Docker Desktop WSL2 and Linux containers)
    const unixSocketPath = '/var/run/docker.sock';
    if (fs.existsSync(unixSocketPath)) {
      this.docker = new Docker({ socketPath: unixSocketPath });
    } else if (process.env.DOCKER_HOST) {
      // Let dockerode parse DOCKER_HOST (e.g., tcp://host:2375 or npipe://...)
      this.docker = new Docker();
    } else {
      // Fallback to defaults; may fail on Windows named pipe when running in WSL/container
      this.docker = new Docker();
    }
  }

  async run(
    language: string,
    codeBuffer: Buffer,
    fileName: string,
    inputData: string,
  ): Promise<RunnerResult> {
    const jobDir = `/tmp/job-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    try {
      fs.mkdirSync(jobDir, { recursive: true });

      const codePath = path.join(jobDir, fileName);
      fs.writeFileSync(codePath, codeBuffer);

      const inputPath = path.join(jobDir, 'input.txt');
      fs.writeFileSync(inputPath, inputData || '');

      const dockerMountedRunnerPath = '/runner-scripts/runner.sh';
      const localRunnerPath = path.resolve(process.cwd(), 'runner-scripts', 'runner.sh');
      const jobRunnerPath = path.join(jobDir, 'runner.sh');

      const sourceRunnerPath = fs.existsSync(dockerMountedRunnerPath)
        ? dockerMountedRunnerPath
        : (fs.existsSync(localRunnerPath) ? localRunnerPath : null);

      if (!sourceRunnerPath) {
        throw new Error('Runner script not found at /runner-scripts/runner.sh or runner-scripts/runner.sh');
      }

      fs.copyFileSync(sourceRunnerPath, jobRunnerPath);
      fs.chmodSync(jobRunnerPath, 0o755);

      const image = this.getDockerImage(language);
      await this.ensureImageExists(image);

      const startTime = Date.now();
      const container = await this.docker.createContainer({
        Image: image,
        Cmd: ['/bin/sh', '/job/runner.sh', language, fileName],
        HostConfig: {
          Binds: [`${jobDir}:/job`],
          Memory: 256 * 1024 * 1024,
          MemorySwap: 256 * 1024 * 1024,
          NanoCpus: 1000000000,
          NetworkMode: 'none',
          AutoRemove: false,
        },
        WorkingDir: '/job',
      });

      await container.start();

      const waitPromise = container.wait();
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Execution timeout')), 10000));

      let waitResult: any;
      try {
        waitResult = await Promise.race([waitPromise, timeoutPromise]);
      } catch (error) {
        try {
          await container.kill();
        } catch {}
        throw error;
      }

      const executionTime = Date.now() - startTime;

      const logs = await container.logs({ stdout: true, stderr: true, follow: false });
      const { stdout, stderr } = this.parseDockerLogs(logs as Buffer);

      let memoryUsed = 0;
      try {
        const stats: any = await container.stats({ stream: false });
        memoryUsed = stats.memory_stats?.usage || 0;
      } catch {}

      try {
        await container.remove({ force: true });
      } catch {}

      return { output: stdout, error: stderr, exitCode: waitResult.StatusCode, executionTime, memoryUsed };
    } finally {
      try {
        if (fs.existsSync(jobDir)) {
          fs.rmSync(jobDir, { recursive: true, force: true });
        }
      } catch {}
    }
  }

  private getDockerImage(language: string): string {
    const images: Record<string, string> = {
      python: 'python:3.11-alpine',
      c: 'gcc:latest',
      cpp: 'gcc:latest',
      java: 'openjdk:17-alpine',
      javascript: 'node:20-alpine',
    };
    const image = images[language.toLowerCase()];
    if (!image) {
      throw new Error(`Unsupported language: ${language}`);
    }
    return image;
  }

  private async ensureImageExists(image: string): Promise<void> {
    try {
      await this.docker.getImage(image).inspect();
    } catch (error: any) {
      if (error.statusCode === 404) {
        await new Promise((resolve, reject) => {
          this.docker.pull(image, (err, stream) => {
            if (err) return reject(err);
            this.docker.modem.followProgress(stream, (err2: any) => (err2 ? reject(err2) : resolve(undefined)));
          });
        });
      } else {
        throw error;
      }
    }
  }

  private parseDockerLogs(buffer: Buffer): { stdout: string; stderr: string } {
    let stdout = '';
    let stderr = '';
    let offset = 0;
    while (offset < buffer.length) {
      if (offset + 8 > buffer.length) break;
      const streamType = buffer[offset];
      const size = (buffer[offset + 4] << 24) | (buffer[offset + 5] << 16) | (buffer[offset + 6] << 8) | buffer[offset + 7];
      offset += 8;
      if (offset + size > buffer.length) break;
      const chunk = buffer.slice(offset, offset + size).toString('utf8');
      if (streamType === 1) stdout += chunk;
      else if (streamType === 2) stderr += chunk;
      offset += size;
    }
    return { stdout, stderr };
  }
}

export { CodeRunnerRepo };
// DockerRunnerService se mantiene temporalmente para compatibilidad


