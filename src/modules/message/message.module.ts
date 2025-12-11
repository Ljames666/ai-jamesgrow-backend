// src/modules/message/message.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './message.schema';
import { MessageService } from './message.service';
import { MessageController, ChatController } from './message.controller';
import { AuthModule } from '../auth/auth.module';
import { AiService } from 'src/core/ai/ai.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    AuthModule, // para usar o guard
  ],
  providers: [MessageService, AiService],
  controllers: [MessageController, ChatController],
  exports: [MessageService, AiService],
})
export class MessageModule {}
