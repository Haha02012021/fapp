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
import { Chat } from 'src/chat/chat.model';
import { User } from 'src/user/user.model';

@Table
export class ChatsUsers extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @AllowNull(false)
  @ForeignKey(() => Chat)
  @Column(DataType.BIGINT)
  chatId: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.BIGINT)
  memberId: number;
}
