import { PostsUsers } from '../postsusers/postsusers.model';
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
import { Image } from 'src/image/image.model';
import { User } from 'src/user/user.model';
import Comment from 'src/comment/comment.model';

export enum STATUS {
    SAD = 0,
    TIRED = 1,
    NOMAL = 2,
    EXCITED = 3,
    HAPPY = 4,
}

@Table
export class Post extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number;

    @Default(STATUS.NOMAL)
    @Column
    status: STATUS;

    @Default('')
    @Column
    content: string;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    ownerId: number;

    @BelongsTo(() => User)
    owner: User;

    @HasMany(() => Image)
    images: Image[];

    @BelongsToMany(() => User, () => PostsUsers)
    users: User[];

    @HasMany(() => Comment)
    comments: Comment[];
}
