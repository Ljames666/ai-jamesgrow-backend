// src/core/ai/ai.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProvider } from './ai.provider.interface';
import { GeminiProvider } from './providers/gemini.provider';
import { GptProvider } from './providers/gpt.provider';
import { QwenProvider } from './providers/qwen.provider';
import { AiModel } from '../../modules/message/message.schema';

@Injectable()
export class AiService {
  private readonly providers: Record<AiModel, AiProvider>;

  constructor(private configService: ConfigService) {
    this.providers = {
      gemini: new GeminiProvider(configService),
      gpt: new GptProvider(configService),
      qwen: new QwenProvider(configService),
    };
  }

  getProvider(model: AiModel): AiProvider {
    const provider = this.providers[model];
    if (!provider) {
      throw new Error(`Unsupported AI model: ${model}`);
    }
    return provider;
  }
}
