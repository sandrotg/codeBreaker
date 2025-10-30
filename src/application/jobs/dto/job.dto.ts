import { IsNotEmpty, IsString } from 'class-validator';

export class SubmitJobDto {
  @IsString()
  @IsNotEmpty()
  fileKey!: string;

  @IsString()
  @IsNotEmpty()
  language!: string;

  @IsString()
  @IsNotEmpty()
  inputKey!: string;
}

export class JobDto {
  id!: string;
  fileKey!: string;
  inputKey!: string;
  language!: string;
  status!: string;
  output?: string;
  error?: string;
  exitCode?: number;
  executionTime?: number;
  memoryUsed?: number;
  createdAt!: Date;
}

export class GenerateUploadUrlDto {
  @IsString()
  @IsNotEmpty()
  fileName!: string;
}

export class UploadUrlResponseDto {
  presignedUrl!: string;
  objectKey!: string;
}


