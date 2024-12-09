import { sequelize } from '../../config/connectDB';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import IRoom from './room.interface';

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
  public dienTich!: string;
  public phongChungChu!: boolean;
  public gacXep!: boolean;
  public soLuongPhongNgu!: number;
  public soTang!: number;
  public soNguoiToiDa!: number;
  public trangThaiPhong!: string;


  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
        type: DataTypes.STRING,
        allowNull: false,
      },
      phongChungChu: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      gacXep: { 
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
      timestamps: true,
    }
  );
  
  export default Room;