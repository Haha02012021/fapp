import { CharacterService } from './character.service';
import { Module } from '@nestjs/common';
import { CharacterController } from './character.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Character } from './character.model';

@Module({
  imports: [SequelizeModule.forFeature([Character])],
  controllers: [CharacterController],
  providers: [CharacterService],
})
export class CharacterModule {}
