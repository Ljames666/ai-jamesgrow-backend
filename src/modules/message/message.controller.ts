// src/modules/message/message.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessageService } from './message.service';
import { AiModel } from './message.schema';

class CreateMessageDto {
  content: string;
  aiModel: AiModel;
}

@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateMessageDto) {
    const userId = req.user._id;
    // Apenas registra a mensagem do usuário — a resposta da IA será gerada depois (Etapa 4)
    return this.messageService.create(userId, 'user', dto.content, dto.aiModel);
  }

  @Get()
  async findAll(@Request() req, @Query('aiModel') aiModel?: AiModel) {
    const userId = req.user._id;
    return this.messageService.findAllByUser(userId, aiModel);
  }
}
