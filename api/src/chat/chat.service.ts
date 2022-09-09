import { Message } from './../message/message.model';
import { CHAT_TYPE } from 'src/chat/chat.model';
import { where } from 'sequelize/types';
import { User } from './../user/user.model';
import { Sequelize, Model } from 'sequelize-typescript';
import { Injectable } from '@nestjs/common';
import { Chat } from './chat.model';
import { ChatsUsers } from 'src/chatsusers/chatsusers.model';

@Injectable()
export class ChatService {
  constructor(private sequelize: Sequelize) {}
  async createTwo(chat: any) {
    try {
      const existChat = await this.sequelize.query(
        `select chats.*, chatsusers.memberId from chats join chatsusers on chats.id = chatId 
        where type = ${CHAT_TYPE.TWO} and 
        (chats.ownerId = ${chat.ownerId} and memberId = ${chat.memberId}) or 
        (chats.ownerId = ${chat.memberId} and memberId = ${chat.ownerId})`,
      );

      if (existChat[0].length > 0) {
        return {
          success: true,
          data: existChat[0][0],
          message: 'create chat successfully',
        };
      } else {
        const newChat = await Chat.create({
          ownerId: chat.ownerId,
        });

        console.log(newChat);

        const addMember = await ChatsUsers.bulkCreate([
          {
            chatId: newChat.getDataValue('id'),
            memberId: chat.memberId,
          },
          {
            chatId: newChat.getDataValue('id'),
            memberId: chat.ownerId,
          },
        ]);

        return {
          success: true,
          data: {
            type: newChat.getDataValue('type'),
            id: newChat.getDataValue('id'),
            ownerId: newChat.getDataValue('ownerId'),
            memberId: addMember[0].getDataValue('memberId'),
          },
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getChat(id: number) {
    try {
      const chat = await Chat.findOne({
        where: {
          id,
        },
        include: [
          {
            model: User,
            as: 'members',
          },
        ],
      });
      const messages = await Message.findAll({
        include: [
          {
            model: User,
            as: 'owner',
          },
        ],
        where: {
          chatId: id,
        },
      });

      return {
        success: true,
        data: {
          chat,
          messages,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getChatsByMemberId(id: number, type: number) {
    try {
      const chats = await User.findOne({
        include: [
          {
            model: Chat,
            as: 'chats',
          },
        ],
        where: {
          id,
        },
      }).then(async (user) => {
        console.log(user.chats);
        return user.chats;
      });

      const chatDetails = [];
      for (let i = 0; i < chats.length; i++) {
        const chatDetail = await Chat.findOne({
          where: {
            id: chats[i].id,
            type,
          },
          include: [
            {
              model: User,
              as: 'members',
            },
          ],
        });

        chatDetails.push(chatDetail);
      }

      return {
        success: true,
        data: chatDetails,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
