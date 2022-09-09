import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Chat } from 'src/chat/chat.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';

@Module({
  imports: [SequelizeModule.forFeature([Chat])],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
