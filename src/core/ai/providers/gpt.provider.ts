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

  async generateResponse(prompt: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        timeout: 10000,
      });
      return completion.choices[0].message.content || '';
    } catch (error) {
      console.error('OpenAI error:', error);
      throw new Error('Failed to get response from GPT');
    }
  }
}
