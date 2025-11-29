import { Injectable } from '@nestjs/common';
import { Ollama } from 'ollama';
import type { ChallengeResponse } from '../../presentation/challenges/dtos/response.dto';

@Injectable()
export class OllamaValidatorService {
  async refineChallenge(challenge: ChallengeResponse): Promise<ChallengeResponse | null> {
    try {
      const prompt = `
Revisa y mejora este reto. No cambies su intención.
Devuelve SOLO JSON válido sin texto extra:

${JSON.stringify(challenge, null, 2)}
`;

      const ollama = new Ollama({
        host: 'https://ollama.com',
        headers: {
          Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
        },
      });
      
      const response = await ollama.chat({
        model: 'deepseek-v3.1:671b-cloud',
        messages: [{ role: 'user', content: prompt }],
      });

      // Limpiar la respuesta de Ollama (puede venir con ```json ... ```)
      let content = response.message.content.trim();

      // Remover markdown code fence si existe
      if (content.startsWith('```')) {
        content = content.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
      }

      const refined = JSON.parse(content);
      return refined;
    } catch (e) {
      console.log('⚠️ Ollama no disponible, se usará revisión humana');
      console.log(e);
      return null;
    }
  }
}
