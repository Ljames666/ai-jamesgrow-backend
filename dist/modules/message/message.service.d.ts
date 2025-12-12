import { Model } from 'mongoose';
import { Message, MessageDocument, AiModel } from './message.schema';
export declare class MessageService {
    private messageModel;
    constructor(messageModel: Model<MessageDocument>);
    create(userId: string, role: 'user' | 'ai', content: string, aiModel: AiModel): Promise<Message>;
    findAllByUser(userId: string, aiModel?: AiModel): Promise<Message[]>;
    deleteAllByUser(userId: string): Promise<void>;
}
