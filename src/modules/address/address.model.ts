import { sequelize } from '../../config/connectDB';
import {DataTypes, Model, Optional } from 'sequelize';
import IAddress from './address.interface';

interface AddressCreationAttributes extends Optional<IAddress, 'maDiaChi'> {}

// Định nghĩa model Address
class Address extends Model<IAddress, AddressCreationAttributes> implements IAddress {
  public maDiaChi!: number;
  public soNha!: string;
  public phuongXa!: string;
  public quanHuyen!: string;
  public tinhThanh!: string;
  public kinhDo!: number;
  public viDo!: number;
  // Timestamps
  // public readonly createdAt!: Date;
  // public readonly updatedAt!: Date;
}

// Khởi tạo model với Sequelize
Address.init(
  {
    maDiaChi: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    soNha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phuongXa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quanHuyen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tinhThanh: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kinhDo: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    viDo: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize, // Đối tượng kết nối
    tableName: 'DiaChi',
    modelName: 'DiaChi',
    timestamps: false,
  }
);

export default Address;