import { MessageDto } from './message.dto';
import { MessageService } from './message.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}
  @Post('create')
  create(@Body() message: MessageDto) {
    return this.messageService.create(message);
  }
}
