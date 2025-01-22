import { sequelize } from '../../config/connectDB';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import IRoom from './room.interface';
import User from '../users/users.model';
import Address from '../address/address.model';
import RoomType from '../room_type/room_type.model';
import Interior from '../interior/interior.model';

interface RoomCreationAttributes extends Optional<IRoom, 'maPhong'> {}

// Định nghĩa model Room
class Room extends Model<IRoom, RoomCreationAttributes> implements IRoom {
  public maPhong!: number;
  public maNguoiDung!: number;
  public maLoaiPhong!: number;
  public maDiaChi!: number ;
  public maNoiThat!: number;
  public tieuDe!: string;
  public moTa!: string;
  public giaPhong!: number;
  public giaDien!: number;
  public giaNuoc!: number;
  public dienTich!: number;
  public phongChungChu!: boolean;
  public nhaBep!: boolean;
  public gacXep!: boolean;
  public nhaDeXe!: boolean;
  public nhaVeSinh!: string;
  public soLuongPhongNgu!: number;
  public soTang!: number;
  public soNguoiToiDa!: number;
  public trangThaiPhong!: string;


  // Timestamps
  // public readonly createdAt!: Date;
  // public readonly updatedAt!: Date;
}

Room.init(
    {
      maPhong: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      maNguoiDung: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      maLoaiPhong: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      maDiaChi: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      maNoiThat: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tieuDe: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      moTa: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      giaPhong: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      giaDien: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      giaNuoc: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dienTich: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      phongChungChu: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      nhaBep: { 
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      gacXep: { 
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      nhaVeSinh: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nhaDeXe: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      soLuongPhongNgu: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      soTang: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      soNguoiToiDa: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      trangThaiPhong: {
        type: DataTypes.STRING,
        allowNull: false,
      },

    },
    {
      sequelize, // Đối tượng kết nối
      tableName: 'Phong',
      modelName: 'Phong',
      timestamps: false,
    }
  );


  
  export default Room;