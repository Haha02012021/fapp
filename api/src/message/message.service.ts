import { MessageDto } from './message.dto';
import { Sequelize } from 'sequelize-typescript';
import { Injectable } from '@nestjs/common';
import { Chat, CHAT_TYPE } from 'src/chat/chat.model';
import { Message } from './message.model';

@Injectable()
export class MessageService {
  constructor(private sequelize: Sequelize) {}
  async create(message: MessageDto) {
    try {
      const newMsg = await Message.create({
        ...message,
      });

      return {
        success: true,
        data: newMsg,
        message: 'create a message successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
