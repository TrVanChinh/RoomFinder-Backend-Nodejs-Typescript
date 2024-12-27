import { sequelize } from '../../config/connectDB';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import INotification from './notification.interface'

interface BiilCreationAttributes extends Optional<INotification, 'maThongBao'> {}
class Notification extends Model<INotification, BiilCreationAttributes> implements INotification {
  public maThongBao!: number; 
  public maNguoiDung!: number;
  public maPhong!: number | null;
  public maLoaiThongBao!: number;
  public maHoaDon!: number | null; 
  public trangThai!: string;  
  public noiDungThongBao!: string; 
  public thoiGian!: Date;

}

Notification.init(
  {
    maThongBao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    maNguoiDung: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
    maPhong: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    maLoaiThongBao: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    maHoaDon: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    noiDungThongBao: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    trangThai: {
      type: DataTypes.STRING,
      allowNull: false,
  },
    thoiGian: {
        type: DataTypes.DATE,
        allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'ThongBao',
    modelName: 'ThongBao',
    timestamps: false, 
  }
);

export default Notification;