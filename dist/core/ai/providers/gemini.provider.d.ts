import { AiProvider } from '../ai.provider.interface';
import { ConfigService } from '@nestjs/config';
export declare class GeminiProvider implements AiProvider {
    private configService;
    private genAi;
    private model;
    constructor(configService: ConfigService);
    generateResponse(contents: string): Promise<string>;
}
