import { CharactersUsers } from 'src/charactersusers/charactersusers.model';
import { Sequelize } from 'sequelize-typescript';
import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';

@Injectable()
export class CharactersusersService {
  constructor(private sequelize: Sequelize) {}

  async create(charactersUser: any) {
    try {
      const characters = await CharactersUsers.bulkCreate(charactersUser);

      return {
        success: true,
        data: characters,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async deleteByUser(userId: number) {
    try {
      await CharactersUsers.destroy({
        where: {
          userId,
        },
      });

      return {
        success: true,
        message: 'delete characters of user successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };
}
