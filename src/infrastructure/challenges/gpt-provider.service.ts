import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import type { ChallengeResponse } from '../../presentation/challenges/dtos/response.dto';

@Injectable()
export class GptProviderService {
  private client?: OpenAI;

  private getClient(): OpenAI {
    if (!this.client) {
      const key = process.env.OPENAI_API_KEY;
      if (!key) {
        throw new Error('Missing OPENAI_API_KEY. Set the environment variable or add it to a .env file.');
      }
      this.client = new OpenAI({ apiKey: key });
    }
    return this.client;
  }

  async generate(topic: string): Promise<ChallengeResponse> {
    const prompt = `
Genera 1 reto de programación sobre el tema: "${topic}".
Responde en formato JSON válido. Sin explicaciones, sin markdown.

{
  "title": "",
  "description": "",
  "inputDescription": "",
  "outputDescription": "",
  "examples": [
    { "input": "", "output": "" }
  ]
}
`;

    const response = await this.getClient().responses.create({
      model: 'gpt-5-nano',
      input: prompt,
    });
    const text = response.output_text;

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error('❌ GPT devolvió JSON inválido:', text);
      throw new Error('GPT devolvió una estructura no parseable. Ajustar prompt.');
    }

    return data;
  }
}
