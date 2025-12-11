// src/modules/message/message.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { MessageService } from './message.service';
import { AiModel } from './message.schema';
import { AiService } from '../../core/ai/ai.service';

@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessageController {
  constructor(private messageService: MessageService) {}
  @Get()
  async findAll(
    @Request() req: ExpressRequest & { user: { _id: string } },
    @Query('aiModel') aiModel?: AiModel,
  ) {
    const userId = req.user._id;
    return this.messageService.findAllByUser(userId, aiModel);
  }
}

class ChatRequestDto {
  content: string;
  aiModel: AiModel;
}

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(
    private messageService: MessageService,
    private aiService: AiService,
  ) {}
  @Post()
  async sendMessage(
    @Request() req: ExpressRequest & { user: { _id: string } },
    @Body() dto: ChatRequestDto,
  ) {
    const userId = req.user._id;

    // Salvar mensagem do usuário
    await this.messageService.create(userId, 'user', dto.content, dto.aiModel);

    let aiResponse = '';
    try {
      const provider = this.aiService.getProvider(dto.aiModel);
      aiResponse = await provider.generateResponse(dto.content);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        `AI model ${dto.aiModel} failed: ${errorMessage}`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    // Salvar resposta da IA
    await this.messageService.create(userId, 'ai', aiResponse, dto.aiModel);

    return {
      userMessage: dto.content,
      aiResponse,
      aiModel: dto.aiModel,
    };
  }
}
