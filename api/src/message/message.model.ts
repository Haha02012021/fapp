import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Chat } from 'src/chat/chat.model';
import { Post } from 'src/post/post.model';
import { User } from 'src/user/user.model';

export enum MESSAGE_TYPE {
  CHAT = 0,
  CONTACT = 1,
}

@Table
export class Message extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  content: string;

  @AllowNull(false)
  @Column
  type: MESSAGE_TYPE;

  @AllowNull
  @ForeignKey(() => Post)
  @Column(DataType.BIGINT)
  replyFor: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.BIGINT)
  ownerId: number;

  @AllowNull(false)
  @ForeignKey(() => Chat)
  @Column(DataType.BIGINT)
  chatId: number;

  @BelongsTo(() => User)
  owner: User;

  @BelongsTo(() => Post)
  post: Post;

  @BelongsTo(() => Chat)
  chat: Chat;
}
