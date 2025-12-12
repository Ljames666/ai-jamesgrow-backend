import { ConfigService } from '@nestjs/config';
import { AiProvider } from './ai.provider.interface';
import { AiModel } from '../../modules/message/message.schema';
export declare class AiService {
    private configService;
    private readonly providers;
    constructor(configService: ConfigService);
    getProvider(model: AiModel): AiProvider;
}
