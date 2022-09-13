import { NotificationsUsers } from './../notificationsusers/notificationsusers.model';
import { AllowNull, AutoIncrement, BelongsTo, BelongsToMany, Column, DataType, Default, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "src/user/user.model";

export enum NOTI_STATE {
    WAITING = 0,
    READ = 1,
}

@Table
export class Notification extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number;

    @AllowNull(false)
    @Column
    content: string;

    @AllowNull(false)
    @Column
    link: string;

    @Default(NOTI_STATE.WAITING)
    @Column
    state: NOTI_STATE;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    ownerId: number;

    @BelongsToMany(() => User, () => NotificationsUsers, 'notificationId', 'userId')
    users: User[];

    @BelongsTo(() => User, 'ownerId')
    owner: User;
}
