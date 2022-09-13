import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    Default,
    ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { Post } from 'src/post/post.model';
import { User } from 'src/user/user.model';

@Table
export default class Comment extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number;

    @AllowNull(false)
    @Column
    content: string;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    ownerId: number;

    @AllowNull(false)
    @ForeignKey(() => Post)
    @Column(DataType.BIGINT)
    postId: number;

    @AllowNull
    @ForeignKey(() => Comment)
    @Column(DataType.BIGINT)
    parentId: number;

    @BelongsTo(() => User)
    owner: User;

    @BelongsTo(() => Post, {
        foreignKey: 'postId',
        onDelete: 'cascade',
        onUpdate: 'cascade',
    })
    post: Post;

    @BelongsTo(() => Comment)
    parent: Comment;

    @HasMany(() => Comment)
    childComments: Comment[];
}
