import { sequelize } from '../../config/connectDB';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import IBill from './bill.interface'

interface BiilCreationAttributes extends Optional<IBill, 'maHoaDon'> {}
class Bill extends Model<IBill, BiilCreationAttributes> implements IBill {
  public maHoaDon!: number; 
  public maLoaiHoaDon!: number;
  public maPhong!: number;
  public maNguoiDung!: number; 
  public tongSoTien!: number;
  public ngayBatDau!: Date; 
  public ngayKetThuc!: Date; 
  public thoiGianTao!: Date;

}

Bill.init(
  {
    maHoaDon: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    maLoaiHoaDon: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
    maPhong: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    maNguoiDung: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tongSoTien: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ngayBatDau: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    ngayKetThuc: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    thoiGianTao: {
        type: DataTypes.DATE,
        allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'HoaDon',
    modelName: 'HoaDon',
    timestamps: false, 
  }
);

export default Bill;