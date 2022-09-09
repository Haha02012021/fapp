import { User } from 'src/user/user.model';
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
import { Post } from 'src/post/post.model';
import { DataTypes } from 'sequelize/types';

export enum IMAGE_TYPE {
  POST = 'post',
  CHAT = 'chat',
}

@Table
export class Image extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  imgLink: string;

  @AllowNull
  @Column
  description: string;

  @AllowNull(false)
  @Column
  type: IMAGE_TYPE;

  @AllowNull(false)
  @ForeignKey(() => Post)
  @Column(DataType.BIGINT)
  typeId: number;

  @BelongsTo(() => Post, 'typeId')
  post: Post;
}
