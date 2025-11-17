import { Module } from '@nestjs/common';
import { GenerateChallengeUseCase } from '../../../application/challenges/useCases/challenges/generate-challenge.use-case';
import { GptProviderService } from '../../../infrastructure/challenges/gpt-provider.service';
import { OllamaValidatorService } from '../../../infrastructure/challenges/ollama-validator.service';
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
