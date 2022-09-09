import { Sequelize } from 'sequelize-typescript';
import { Injectable } from '@nestjs/common';
import { Character } from './character.model';

@Injectable()
export class CharacterService {
  constructor(private sequelize: Sequelize) {}

  async create(character: string) {
    console.log(character);

    await Character.create({
      name: character,
    });

    return {
      success: true,
      message: 'create character successfully',
    };
  }

  async findAll() {
    try {
      const characters = await Character.findAll({
        attributes: ['id', 'name'],
      });

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
}
