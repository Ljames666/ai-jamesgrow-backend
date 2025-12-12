import { Request as ExpressRequest } from 'express';
import { MessageService } from './message.service';
import { AiModel } from './message.schema';
import { AiService } from '../../core/ai/ai.service';
export declare class MessageController {
    private messageService;
    constructor(messageService: MessageService);
    findAll(req: ExpressRequest & {
        user: {
            _id: string;
        };
    }, aiModel?: AiModel): Promise<import("./message.schema").Message[]>;
}
declare class ChatRequestDto {
    content: string;
    aiModel: AiModel;
}
export declare class ChatController {
    private messageService;
    private aiService;
    constructor(messageService: MessageService, aiService: AiService);
    sendMessage(req: ExpressRequest & {
        user: {
            _id: string;
        };
    }, dto: ChatRequestDto): Promise<{
        userMessage: string;
        aiResponse: string;
        aiModel: AiModel;
    }>;
}
export {};
