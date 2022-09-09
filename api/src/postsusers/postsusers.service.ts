import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { where } from 'sequelize/types';
import { PostsUsersDto } from './postsusers.dto';
import { PostsUsers } from './postsusers.model';

@Injectable()
export class PostsUsersService {
  constructor(private sequelize: Sequelize) {}

  async create(postsUsersDto: PostsUsersDto) {
    try {
      await PostsUsers.create({
        ...postsUsersDto,
      });

      return {
        success: true,
        message: 'create react post successfully',
      };
    } catch (error) {}
  }

  async update(postsUsersDto: PostsUsersDto) {
    try {
      await PostsUsers.update(
        {
          ...postsUsersDto,
        },
        {
          where: {
            [Op.and]: [
              { postId: postsUsersDto.postId },
              { userId: postsUsersDto.userId },
            ],
          },
        },
      );

      return {
        success: true,
        message: 'create react post successfully',
      };
    } catch (error) {}
  }

  async delete(userId: number, postId: number) {
    try {
      const postsUsers = await PostsUsers.findOne({
        where: {
          userId,
          postId,
        },
      });

      await postsUsers.destroy();

      return {
        success: true,
        message: 'delete react post successfully',
      };
    } catch (error) {}
  }
}
