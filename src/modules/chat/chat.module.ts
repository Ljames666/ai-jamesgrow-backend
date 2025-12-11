// src/modules/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { AiService } from '../../core/ai/ai.service';
import { MessageService } from '../message/message.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    ChatGateway,
    AiService,
    MessageService,
    JwtService,
    ConfigService,
  ],
})
export class ChatModule {}
