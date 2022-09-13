import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { Notification } from './notification.model';
import { NotificationsUsers } from 'src/notificationsusers/notificationsusers.model';
import { User } from 'src/user/user.model';
import UserFriends from 'src/userfriends/userfriend.model';

@Module({
    imports: [SequelizeModule.forFeature([Notification, NotificationsUsers, User, UserFriends])],
    controllers: [NotificationController],
    providers: [NotificationService],
})
export class NotificationModule {}
