import { CharactersusersService } from './../charactersusers/charactersusers.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { User } from './user.model';
import { UsersService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { CharactersUsers } from 'src/charactersusers/charactersusers.model';
import UserFriends from 'src/userfriends/userfriend.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, CharactersUsers, UserFriends]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [UsersService, CharactersusersService],
  exports: [SequelizeModule],
})
export class UserModule {}
