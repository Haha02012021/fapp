import { CharactersUsers } from './../charactersusers/charactersusers.model';
import { PostsUsers } from '../postsusers/postsusers.model';
import { Image } from 'src/image/image.model';
import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { Post } from 'src/post/post.model';
import { Character } from 'src/character/character.model';
import { Message } from 'src/message/message.model';
import { Chat } from 'src/chat/chat.model';
import { ChatsUsers } from 'src/chatsusers/chatsusers.model';
import UserFriends from 'src/userfriends/userfriend.model';

export enum UserRole {
  ADMIN = 0,
  USER = 1,
}

export enum SEX {
  MALE = 0,
  FEMALE = 1,
  OTHER = 2,
}

export enum EMOTION_STATE {
  SINGLE = 0,
  CRUSH = 1,
  FLIRTING = 2,
  DATING = 3,
  MARIED = 4,
}

export enum BLOOD_TYPE {
  O = 0,
  A = 1,
  B = 2,
  AB = 3,
}

@Table
export class User extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  id: number;

  @AllowNull(false)
  @Unique
  @Column
  username: string;

  @AllowNull(false)
  @Unique
  @Column
  email: string;

  @Unique
  @Column
  phoneNumber: string;

  @AllowNull(false)
  @Column
  password: string;

  @AllowNull
  @Column
  fullname: string;

  @AllowNull
  @Column
  sex: SEX;

  @AllowNull
  @Column
  age: number;

  @AllowNull
  @Column
  height: number;

  @AllowNull
  @Column
  weight: number;

  @AllowNull
  @Column
  bloodType: BLOOD_TYPE;

  @AllowNull
  @Column
  description: string;

  @Default(UserRole.USER)
  @Column
  role: UserRole;

  @AllowNull
  @Column
  toward: SEX;

  @AllowNull
  @Column
  emotionState: EMOTION_STATE;

  @AllowNull
  @Column
  avatar: string;

  @AllowNull
  @ForeignKey(() => User)
  @Column
  partnerId: number;

  @HasMany(() => Post)
  posts: Post[];

  @BelongsToMany(() => Post, () => PostsUsers)
  reactedPosts: Post[];

  @BelongsToMany(() => Character, () => CharactersUsers)
  characters: Character[];

  @HasMany(() => Message)
  messages: Message[];

  @BelongsToMany(() => Chat, () => ChatsUsers)
  chats: Chat[];

  @BelongsToMany(() => User, () => UserFriends)
  friends: User[];
}
