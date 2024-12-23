import { sequelize } from '../../config/connectDB';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import  IRoomType  from './room_type.interface'
import Room from '../room/room.model';

interface RoomTypeCreationAttributes extends Optional<IRoomType, 'maLoaiPhong'> {}

// Định nghĩa model RoomType
class RoomType extends Model<IRoomType, RoomTypeCreationAttributes> implements IRoomType {
  public maLoaiPhong!: number; // Primary key
  public loaiPhong!: string;
  public phiDichVu!: number;

  // Timestamps
  // public readonly createdAt!: Date;
  // public readonly updatedAt!: Date;
}

RoomType.init(
  {
    maLoaiPhong: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    loaiPhong: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phiDichVu: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize, // Đối tượng kết nối
    tableName: 'LoaiPhong',
    modelName: 'LoaiPhong',
    timestamps: false, // Sequelize sẽ tự động thêm `createdAt` và `updatedAt`
  }
);

export default RoomType;