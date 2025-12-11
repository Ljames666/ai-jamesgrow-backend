/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/core/ai/providers/gpt.provider.ts
import { OpenAI } from 'openai';
import { AiProvider } from '../ai.provider.interface';
import { ConfigService } from '@nestjs/config';

export class GptProvider implements AiProvider {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is missing');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async generateResponse(content: string, retries = 5): Promise<string> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content }],
        });
        console.log('GPT response:', response);

        return response.choices[0].message.content ?? '';
      } catch (err: any) {
        if (err.status === 429) {
          const wait = Math.pow(2, attempt) * 1000; // Exponential backoff
          console.log(
            `Limite atingido. Tentando novamente em ${wait / 1000}s...`,
          );
          await new Promise((r) => setTimeout(r, wait));
        } else {
          throw err; // outro erro, não é de limite
        }
      }
    }
    throw new Error('Número máximo de tentativas excedido');
  }
}
