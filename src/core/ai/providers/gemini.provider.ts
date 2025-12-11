// src/core/ai/providers/gemini.provider.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AiProvider } from '../ai.provider.interface';
import { ConfigService } from '@nestjs/config';

export class GeminiProvider implements AiProvider {
  private genAi: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is missing');
    }
    this.genAi = new GoogleGenerativeAI(apiKey);
    this.model = this.genAi.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini error:', error);
      throw new Error('Failed to get response from Gemini');
    }
  }
}
