import { AiProvider } from '../ai.provider.interface';
import { ConfigService } from '@nestjs/config';
export declare class GptProvider implements AiProvider {
    private configService;
    private openai;
    constructor(configService: ConfigService);
    generateResponse(content: string, retries?: number): Promise<string>;
}
