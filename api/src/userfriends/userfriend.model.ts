import { User } from 'src/user/user.model';
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export enum FRIEND_TYPE {
  WAIT = -1,
  NORMAL = 0,
  CLOSE = 1,
}

@Table
export default class UserFriends extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.BIGINT)
  userId: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.BIGINT)
  friendId: number;

  @AllowNull
  @Column
  type: FRIEND_TYPE;
}
