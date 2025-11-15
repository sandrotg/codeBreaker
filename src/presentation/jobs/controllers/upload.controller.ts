import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'src/infrastructure/minio/minio.service';
import { GenerateUploadUrlDto } from 'src/application/jobs/dto/job.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly minioService: MinioService) {}

  @Post('generate-url')
  async generateUploadUrl(@Body() dto: GenerateUploadUrlDto) {
    try {
      const validExtensions = ['.py', '.c', '.cpp', '.java', '.js', '.txt'];
      const hasValidExtension = validExtensions.some((ext) => dto.fileName.toLowerCase().endsWith(ext));
      if (!hasValidExtension) {
        throw new HttpException(`Invalid file extension. Allowed: ${validExtensions.join(', ')}`, HttpStatus.BAD_REQUEST);
      }

      const result = await this.minioService.generatePresignedUploadUrl(dto.fileName);
      return { success: true, data: result };
    } catch (error: any) {
      throw new HttpException(error.message || 'Failed to generate presigned URL', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}


