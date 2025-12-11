// src/modules/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UseGuards } from '@nestjs/common';
import { AiService } from '../../core/ai/ai.service';
import { MessageService } from '../message/message.service';
import { AiModel } from '../message/message.schema';

interface AuthenticatedSocket extends Socket {
  user?: { _id: string; username: string };
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private aiService: AiService,
    private messageService: MessageService,
  ) {}

  async handleConnection(client: AuthenticatedSocket, ...args: any[]) {
    const token = this.extractTokenFromHandshake(client);
    if (!token) {
      client.disconnect(true);
      return;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      client.user = { _id: payload.sub, username: payload.username };
      console.log(`User ${payload.username} connected via WebSocket`);
    } catch (err) {
      console.warn('Invalid JWT in WebSocket handshake', err.message);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    console.log('Client disconnected');
  }

  private extractTokenFromHandshake(client: AuthenticatedSocket): string | null {
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    // Também suporta query param para facilitar testes
    return client.handshake.query?.token as string | null;
  }

  @SubscribeMessage('chat:message')
  async handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody()  { content: string; aiModel: AiModel },
  ) {
    if (!client.user) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    const { content, aiModel } = data;
    const userId = client.user._id;

    // Salvar mensagem do usuário
    await this.messageService.create(userId, 'user', content, aiModel);

    // Notificar que IA está "digitando"
    client.emit('typing', { aiModel });

    let aiResponse = '';
    try {
      const provider = this.aiService.getProvider(aiModel);
      aiResponse = await provider.generateResponse(content);
    } catch (error) {
      client.emit('error', {
        message: `Failed to get response from ${aiModel}: ${error.message}`,
      });
      return;
    }

    // Salvar resposta da IA
    await this.messageService.create(userId, 'ai', aiResponse, aiModel);

    // Enviar resposta ao cliente
    client.emit('message', {
      role: 'ai',
      content: aiResponse,
      aiModel,
    });
  }
}