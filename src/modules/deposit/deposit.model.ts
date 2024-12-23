import { sequelize } from '../../config/connectDB';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import IDeposit from './deposit.interface';

interface DepositCreationAttributes extends Optional<IDeposit, 'maPhiDatCoc'> {}

class Deposit extends Model<IDeposit, DepositCreationAttributes> implements IDeposit {
  public maPhiDatCoc!: number;
  public maPhong!: number;
  public phiDatCoc!: number;
  public thoiHanDatCoc!: number;
  public donViThoiGian!: string;

  // Timestamps
  // public readonly createdAt!: Date;
  // public readonly updatedAt!: Date;
}

// Khởi tạo model với Sequelize
Deposit.init(
  {
    maPhiDatCoc: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    maPhong: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    phiDatCoc: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    thoiHanDatCoc: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    donViThoiGian: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'ChiPhiDatCoc',
    modelName: 'ChiPhiDatCoc',
    timestamps: false,
  }
);

export default Deposit;
