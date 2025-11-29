import { Injectable } from '@nestjs/common';
import { GptProviderService } from '../../../../infrastructure/challenges/gpt-provider.service';
import { OllamaValidatorService } from '../../../../infrastructure/challenges/ollama-validator.service';
import type { ChallengeResponse } from '../../../../presentation/challenges/dtos/response.dto';

@Injectable()
export class GenerateChallengeUseCase {
  constructor(
    private readonly gpt: GptProviderService,
    private readonly ollama: OllamaValidatorService,
  ) {}

  async execute(theme: string): Promise<ChallengeResponse> {
    // 1. Generar challenge con GPT
    const challenge = await this.gpt.generate(theme);

    // 2. Refinar con Ollama
    const refined = await this.ollama.refineChallenge(challenge);

    if (!refined) {
      return { ...challenge, reviewedBy: 'human_required' };
    }

    return { ...refined, reviewedBy: 'ollama' };
  }
}
