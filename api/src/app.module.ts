import { ChatsUsers } from 'src/chatsusers/chatsusers.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CharacterController } from './character/character.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/user.model';
import { PostService } from './post/post.service';
import { PostModule } from './post/post.module';
import { Post } from './post/post.model';
import { ImageModule } from './image/image.module';
import { Image } from './image/image.model';
import { PostsUsers } from './postsusers/postsusers.model';
import { PostsUsersModule } from './postsusers/postsusers.module';
import { PostsUsersService } from './postsusers/postsusers.service';
import { PostsUsersController } from './postsusers/postsusers.controller';
import { CharacterService } from './character/character.service';
import { CharacterModule } from './character/character.module';
import { CharactersUsers } from './charactersusers/charactersusers.model';
import { Character } from './character/character.model';
import { ImageController } from './image/image.controller';
import { ImageService } from './image/image.service';
import { CharactersusersController } from './charactersusers/charactersusers.controller';
import { CharactersusersService } from './charactersusers/charactersusers.service';
import { CharactersusersModule } from './charactersusers/charactersusers.module';
import { ChatService } from './chat/chat.service';
import { Message } from './message/message.model';
import { MessageService } from './message/message.service';
import { MessageController } from './message/message.controller';
import { MessageModule } from './message/message.module';
import { Chat } from './chat/chat.model';
import { DeviceService } from './device/device.service';
import { Device } from './device/device.model';
import { ChatController } from './chat/chat.controller';
import { ChatModule } from './chat/chat.module';
import UserFriends from './userfriends/userfriend.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: 'root',
      database: 'fappdb',
      models: [
        User,
        Post,
        Image,
        PostsUsers,
        Character,
        CharactersUsers,
        Message,
        Chat,
        Device,
        ChatsUsers,
        UserFriends,
      ],
      autoLoadModels: true,
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    PostModule,
    ImageModule,
    PostsUsersModule,
    JwtModule,
    CharacterModule,
    CharactersusersModule,
    MessageModule,
    ChatModule,
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    PostsUsersController,
    CharacterController,
    ImageController,
    CharactersusersController,
    MessageController,
    ChatController,
  ],
  providers: [
    AppService,
    AuthService,
    UsersService,
    PostService,
    PostsUsersService,
    CharacterService,
    ImageService,
    ConfigService,
    CharactersusersService,
    ChatService,
    MessageService,
    DeviceService,
  ],
})
export class AppModule {}
