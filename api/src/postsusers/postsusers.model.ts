import { AllowNull, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Post } from 'src/post/post.model';
import { User } from 'src/user/user.model';

export enum REACT_TYPE {
    ANGRY = 0,
    DISLIKE = 1,
    SAD = 2,
    LIKE = 3,
    ADMIRE = 4,
    LOVE = 5,
}

@Table
export class PostsUsers extends Model {
    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    userId: number;

    @ForeignKey(() => Post)
    @Column(DataType.BIGINT)
    postId: number;

    @AllowNull
    @Column
    reactType: REACT_TYPE;
}
