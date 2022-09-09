import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Character } from 'src/character/character.model';
import { User } from 'src/user/user.model';

@Table
export class CharactersUsers extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => Character)
  @Column(DataType.BIGINT)
  characterId: number;

  @ForeignKey(() => User)
  @Column(DataType.BIGINT)
  userId: number;
}
