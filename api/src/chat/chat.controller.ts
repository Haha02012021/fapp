import { ChatService } from './chat.service';
import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('create-two')
  create(@Body() chat: any) {
    return this.chatService.createTwo(chat);
  }

  @Get('get/:id')
  get(@Param('id') id: number) {
    return this.chatService.getChat(id);
  }

  @Get('get')
  getChatsByMemberId(@Query('id') id: number, @Query('type') type: number) {
    return this.chatService.getChatsByMemberId(id, type);
  }
}
