import { sequelize } from '../../config/connectDB';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import  ISaveRoom  from './save_room.interface'
import Room from '../room/room.model';

class SaveRoom extends Model<ISaveRoom> implements ISaveRoom {
  public maPhong!: number; // Primary key
  public maNguoiDung!: number;

  // Timestamps
  // public readonly createdAt!: Date;
  // public readonly updatedAt!: Date;
}

SaveRoom.init(
  {
    maPhong: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      maNguoiDung: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
  },
  {
    sequelize, // Đối tượng kết nối
    tableName: 'PhongLuu',
    modelName: 'PhongLuu',
    timestamps: false, // Sequelize sẽ tự động thêm `createdAt` và `updatedAt`
  }
);

export default SaveRoom;