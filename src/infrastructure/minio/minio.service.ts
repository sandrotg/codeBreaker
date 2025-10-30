import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';

@Injectable()
export class MinioService implements OnModuleInit {
  private s3Client: S3Client;
  private s3ClientPublic: S3Client;
  private bucketCode: string;
  private bucketResults: string;
  private bucketInputs: string;
  private publicEndpoint: string;

  constructor() {
    const internalEndpoint = process.env.MINIO_ENDPOINT || 'http://minio:9000';
    this.publicEndpoint = process.env.MINIO_PUBLIC_ENDPOINT || 'http://localhost:9000';

    this.bucketCode = process.env.MINIO_BUCKET_CODE || 'code-files';
    this.bucketResults = process.env.MINIO_BUCKET_RESULTS || 'results';
    this.bucketInputs = process.env.MINIO_BUCKET_INPUTS || 'inputs';

    const credentials = {
      accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin123',
    };

    this.s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: internalEndpoint,
      forcePathStyle: true,
      credentials,
    });

    this.s3ClientPublic = new S3Client({
      region: 'us-east-1',
      endpoint: this.publicEndpoint,
      forcePathStyle: true,
      credentials,
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists(this.bucketCode);
    await this.ensureBucketExists(this.bucketResults);
    await this.ensureBucketExists(this.bucketInputs);
  }

  private async ensureBucketExists(bucketName: string) {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    } catch {
      await this.s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
    }
  }

  async generatePresignedUploadUrl(
    fileName: string,
  ): Promise<{ presignedUrl: string; objectKey: string }> {
    const uniqueId = uuidv4();
    const isInputFile = fileName.toLowerCase().endsWith('.txt');

    let bucket: string;
    let objectKey: string;

    if (isInputFile) {
      bucket = this.bucketInputs;
      objectKey = `${uniqueId}/${fileName}`;
    } else {
      bucket = this.bucketCode;
      objectKey = `code/${uniqueId}/${fileName}`;
    }

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
    });

    const presignedUrl = await getSignedUrl(this.s3ClientPublic, command, {
      expiresIn: 300,
    });

    return { presignedUrl, objectKey };
  }

  async downloadCodeFile(objectKey: string): Promise<Buffer> {
    const command = new GetObjectCommand({ Bucket: this.bucketCode, Key: objectKey });
    const response = await this.s3Client.send(command);
    const stream = response.Body as Readable;
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(Buffer.from(chunk));
    return Buffer.concat(chunks);
  }

  async downloadInputFile(objectKey: string): Promise<Buffer> {
    const command = new GetObjectCommand({ Bucket: this.bucketInputs, Key: objectKey });
    const response = await this.s3Client.send(command);
    const stream = response.Body as Readable;
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(Buffer.from(chunk));
    return Buffer.concat(chunks);
  }

  async uploadResult(jobId: string, result: unknown): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketResults,
      Key: `${jobId}.json`,
      Body: Buffer.from(JSON.stringify(result)),
      ContentType: 'application/json',
    });
    await this.s3Client.send(command);
  }
}


