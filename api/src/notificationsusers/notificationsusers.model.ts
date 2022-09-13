import { AllowNull, AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Notification } from "src/notification/notification.model";
import { User } from "src/user/user.model";

@Table
export class NotificationsUsers extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    userId: number;

    @AllowNull(false)
    @ForeignKey(() => Notification)
    @Column(DataType.BIGINT)
    notificationId: number;
}
