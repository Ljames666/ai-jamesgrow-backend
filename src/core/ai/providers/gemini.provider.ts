// src/core/ai/providers/gemini.provider.ts
import { GoogleGenAI } from '@google/genai';
import { AiProvider } from '../ai.provider.interface';
import { ConfigService } from '@nestjs/config';

export class GeminiProvider implements AiProvider {
  private genAi: GoogleGenAI;
  private model: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is missing');
    }
    this.genAi = new GoogleGenAI({ apiKey });
    this.model = 'gemini-2.5-flash-lite';
  }

  async generateResponse(contents: string): Promise<string> {
    try {
      const result = await this.genAi.models.generateContent({
        model: this.model,
        contents,
      });

      return result.text ?? '';
    } catch (error) {
      console.error('Gemini error:', error);
      throw new Error('Failed to get response from Gemini');
    }
  }
}
