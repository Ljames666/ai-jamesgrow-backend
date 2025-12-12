import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AiService } from '../../core/ai/ai.service';
import { MessageService } from '../message/message.service';
import { AiModel } from '../message/message.schema';
interface AuthenticatedSocket extends Socket {
    user?: {
        _id: string;
        username: string;
    };
}
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private configService;
    private aiService;
    private messageService;
    server: Server;
    constructor(jwtService: JwtService, configService: ConfigService, aiService: AiService, messageService: MessageService);
    handleConnection(client: AuthenticatedSocket, ...args: any[]): void;
    handleDisconnect(client: AuthenticatedSocket): void;
    private extractTokenFromHandshake;
    handleMessage(client: AuthenticatedSocket, data: {
        content: string;
        aiModel: AiModel;
    }): Promise<void>;
}
export {};
