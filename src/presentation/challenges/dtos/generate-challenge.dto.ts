import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateChallengeDto {
  @IsNotEmpty()
  @IsString()
  theme: string;
}
