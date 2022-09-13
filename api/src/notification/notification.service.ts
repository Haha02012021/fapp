import { FRIEND_TYPE } from './../userfriends/userfriend.model';
import { NotificationsUsers } from './../notificationsusers/notificationsusers.model';
import { Injectable } from '@nestjs/common';
import { Notification } from './notification.model';
import { User } from 'src/user/user.model';
import UserFriends from 'src/userfriends/userfriend.model';
import { Op } from 'sequelize';

@Injectable()
export class NotificationService {
    async create(notification: any) {
        try {
            const newNoti = await Notification.create(notification);

            let newNotisUsers: any;
            if (notification.toId) {
                newNotisUsers = await NotificationsUsers.create({
                    notificationId: newNoti.id,
                    userId: notification.toId,
                });
            } else {
                const notisusers = await UserFriends.findAll({
                    where: {
                        userId: notification.ownerId,
                        type: FRIEND_TYPE.NORMAL,
                    },
                }).then((friends) => {
                    return friends.map((friend) => {
                        return {
                            notificationId: newNoti.id,
                            userId: friend.friendId,
                        };
                    });
                });
                newNotisUsers = await NotificationsUsers.bulkCreate(notisusers);
            }

            return {
                success: true,
                data: newNoti,
                message: 'create notification successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async update(id: number, notification: any) {
        try {
            await Notification.update(notification, {
                where: {
                    id,
                },
            });

            return {
                success: true,
                message: 'update notification successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async getNotisByUserId(id: number) {
        try {
            const notis = await User.findOne({
                where: {
                    id,
                },
                include: [
                    {
                        model: Notification,
                        as: 'notifications',
                        include: [
                            {
                                model: User,
                                as: 'owner',
                                attributes: ['id', 'username', 'avatar'],
                            },
                        ],
                        order: [['updatedAt', 'DESC']],
                    },
                ],
            }).then((user) => user.notifications);

            return {
                success: true,
                data: notis,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async remove(notification: any) {
        try {
            await Notification.destroy({
                where: {
                    ...notification,
                },
            });

            return {
                success: true,
                message: 'delete notification successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
}
