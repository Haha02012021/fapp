import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    Default,
    ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { ChatsUsers } from 'src/chatsusers/chatsusers.model';
import { Message } from 'src/message/message.model';
import { User } from 'src/user/user.model';

export enum CHAT_TYPE {
    TWO = 0,
    GROUP = 1,
}

@Table
export class Chat extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number;

    @AllowNull
    @Column
    name: string;

    @AllowNull
    @Column
    avatar: string;

    @Default(CHAT_TYPE.TWO)
    @Column
    type: CHAT_TYPE;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    ownerId: number;

    @BelongsTo(() => User)
    owner: User;

    @HasMany(() => Message)
    messages: Message[];

    @BelongsToMany(() => User, () => ChatsUsers)
    members: User[];
}
