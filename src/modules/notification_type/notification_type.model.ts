import { sequelize } from '../../config/connectDB';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import  INotificationType  from './notification_type.interface'
import Room from '../room/room.model';

interface NotificationTypeCreationAttributes extends Optional<INotificationType, 'maLoaiThongBao'> {}

class NotificationType extends Model<INotificationType, NotificationTypeCreationAttributes> implements INotificationType {
  public maLoaiThongBao!: number; // Primary key
  public tenThongBao!: string;

  // Timestamps
  // public readonly createdAt!: Date;
  // public readonly updatedAt!: Date;
}

NotificationType.init(
  {
    maLoaiThongBao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tenThongBao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize, // Đối tượng kết nối
    tableName: 'LoaiThongBao',
    modelName: 'LoaiThongBao',
    timestamps: false, // Sequelize sẽ tự động thêm `createdAt` và `updatedAt`
  }
);

export default NotificationType;