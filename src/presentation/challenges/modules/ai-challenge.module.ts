import { Module } from '@nestjs/common';
import { GenerateChallengeUseCase } from '../../../modules/ai-challenges/application/use-cases/generate-challenge.use-case';
import { GptProviderService } from '../../../modules/ai-challenges/infrastructure/adapters/gpt-provider.service';
import { OllamaValidatorService } from '../../../modules/ai-challenges/infrastructure/adapters/ollama-validator.service';
import { AIChallengesController } from '../controllers/ai-challenges.controller';

@Module({
  controllers: [AIChallengesController],
  providers: [
    // Use Cases
    GenerateChallengeUseCase,
    
    // Infrastructure Adapters
    GptProviderService,
    OllamaValidatorService,
  ],
  exports: [
    // Export use cases if other modules need them
    GenerateChallengeUseCase,
  ],
})
export class AIChallengeModule {}
