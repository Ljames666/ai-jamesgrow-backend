import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

export type AiModel = 'gemini' | 'gpt';

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ['user', 'ai'] })
  role: 'user' | 'ai';

  @Prop({ required: true, type: String })
  content: string;

  @Prop({ required: true, enum: ['gemini', 'gpt', 'you'] })
  aiModel: AiModel;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
