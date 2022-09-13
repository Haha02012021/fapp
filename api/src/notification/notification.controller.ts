import { NotificationService } from './notification.service';
import { Controller, Post, Body, Get, Param, Delete, Put } from '@nestjs/common';

@Controller('notification')
export class NotificationController {
    constructor(private notificationService: NotificationService) {}
    @Post('create')
    create(@Body() notification: any) {
        return this.notificationService.create(notification);
    }

    @Put('update/:id')
    update(@Param('id') id: number, @Body() notification: any) {
        return this.notificationService.update(id, notification);
    }

    @Get('get-by-user-id/:id')
    getNotisByUserId(@Param('id') id: number) {
        return this.notificationService.getNotisByUserId(id);
    }

    @Delete('remove')
    remove(@Body() notification: any) {
        return this.notificationService.remove(notification);
    }
}
