import { Module } from '@nestjs/common';
import { CharactersusersService } from './charactersusers.service';
import { CharactersusersController } from './charactersusers.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CharactersUsers } from './charactersusers.model';

@Module({
  imports: [SequelizeModule.forFeature([CharactersUsers])],
  providers: [CharactersusersService],
  controllers: [CharactersusersController],
})
export class CharactersusersModule {}
