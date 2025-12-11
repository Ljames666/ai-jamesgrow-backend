// src/core/ai/providers/qwen.provider.ts
import axios from 'axios';
import { AiProvider } from '../ai.provider.interface';
import { ConfigService } from '@nestjs/config';

export class QwenProvider implements AiProvider {
  private readonly apiKey: string;
  private readonly apiUrl =
    'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('QWEN_API_KEY');
    if (!this.apiKey) {
      throw new Error('QWEN_API_KEY is missing');
    }
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'qwen-max',
          input: {
            messages: [{ role: 'user', content: prompt }],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      );
      return response.data.output.text || '';
    } catch (error) {
      console.error('Qwen error:', error.response?.data || error.message);
      throw new Error('Failed to get response from Qwen');
    }
  }
}
