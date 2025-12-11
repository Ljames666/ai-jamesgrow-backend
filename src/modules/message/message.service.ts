// src/modules/message/message.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument, AiModel } from './message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async create(
    userId: string,
    role: 'user' | 'ai',
    content: string,
    aiModel: AiModel,
  ): Promise<Message> {
    const message = new this.messageModel({
      userId,
      role,
      content,
      aiModel,
    });
    return message.save();
  }

  async findAllByUser(userId: string, aiModel?: AiModel): Promise<Message[]> {
    const filter: { userId: string; aiModel?: AiModel } = { userId };
    if (aiModel) filter.aiModel = aiModel;
    return this.messageModel.find(filter).sort({ createdAt: 1 }).exec();
  }

  async deleteAllByUser(userId: string): Promise<void> {
    await this.messageModel.deleteMany({ userId }).exec();
  }
}
