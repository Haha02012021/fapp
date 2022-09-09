import {
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { CharactersUsers } from 'src/charactersusers/charactersusers.model';
import { User } from 'src/user/user.model';

export enum CHARACTER {
  REFORMER = 'Cầu toàn',
  HELPER = 'Tình cảm',
  ACHIEVER = 'Tham vọng',
  INDIVIDUALIST = 'Cá tính',
  INVESTIGATOR = 'Lý trí',
  LOYALIST = 'Trung thành',
  ENTHUSIAST = 'Nhiệt tình',
  CHALLENGER = 'Mạnh mẽ',
  PEACEMAKER = 'Ôn hòa',
}

@Table
export class Character extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @Column
  name: string;

  @BelongsToMany(() => User, () => CharactersUsers)
  users: User[];
}
