import { Injectable } from '@nestjs/common';
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

export class CodeRunnerRepo {
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
      let cmd: string, args: string[];
      let compiled = false;
      switch (language.toLowerCase()) {
        case 'python':
          cmd = 'python3'; args = [fileName]; break;
        case 'javascript':
          cmd = 'node'; args = [fileName]; break;
        case 'c':
          cmd = 'gcc'; args = [fileName, '-o', 'program'];
          await this._compileOrThrow(cmd, args, jobDir);
          cmd = './program'; args = []; compiled = true; break;
        case 'cpp':
          cmd = 'g++'; args = [fileName, '-o', 'program'];
          await this._compileOrThrow(cmd, args, jobDir);
          cmd = './program'; args = []; compiled = true; break;
        case 'java':
          cmd = 'javac'; args = [fileName];
          await this._compileOrThrow(cmd, args, jobDir);
          const className = path.basename(fileName, '.java');
          cmd = 'java'; args = [className]; compiled = true; break;
        default:
          throw new Error(`Unsupported language: ${language}`);
      }
      const result = await this._runJob(cmd, args, jobDir, compiled ? undefined : inputPath);
      return result;
    } finally {
      try { if (fs.existsSync(jobDir)) fs.rmSync(jobDir, { recursive: true, force: true }); } catch {}
    }
  }

  private _compileOrThrow(cmd: string, args: string[], cwd: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const proc = spawn(cmd, args, { cwd });
      let stderr = '';
      proc.stderr.on('data', d => { stderr += d.toString(); });
      proc.on('close', code => {
        if (code !== 0) reject(new Error('Compilation failed: ' + stderr));
        else resolve();
      });
    });
  }

  private _runJob(cmd: string, args: string[], cwd: string, inputPath?: string): Promise<RunnerResult> {
    return new Promise((resolve) => {
      const start = Date.now();
      const proc = spawn(cmd, args, { cwd });
      let stdout = '', stderr = '';
      let exited = false;
      if (inputPath) {
        const inputStream = fs.createReadStream(inputPath);
        inputStream.pipe(proc.stdin);
      }
      proc.stdout.on('data', chunk => { stdout += chunk.toString(); });
      proc.stderr.on('data', chunk => { stderr += chunk.toString(); });
      proc.on('close', code => {
        const end = Date.now();
        exited = true;
        resolve({
          output: stdout,
          error: stderr,
          exitCode: code ?? -1,
          executionTime: end - start,
          memoryUsed: 0 // Opcional: calcular
        });
      });
      setTimeout(() => {
        if (!exited) {
          proc.kill('SIGKILL');
          resolve({
            output: stdout,
            error: stderr + '\nTimeout exceeded',
            exitCode: -1,
            executionTime: Date.now() - start,
            memoryUsed: 0,
          });
        }
      }, 10000);
    });
  }
}


