import { Module } from '@nestjs/common';
import { Message } from './message.model';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([Message])],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
