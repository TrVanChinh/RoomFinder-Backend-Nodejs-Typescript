import { sequelize } from '../../config/connectDB';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import  IReport  from './report.interface'

interface ReportCreationAttributes extends Optional<IReport, 'maBaoCao'> {}

// Định nghĩa model RoomType
class Report extends Model<IReport, ReportCreationAttributes> implements IReport {
  public maBaoCao!: number; // Primary key
  public maNguoiDung!: number;
  public maPhong!: number;
  public noiDungBaoCao!: string;

  // Timestamps
  // public readonly createdAt!: Date;
  // public readonly updatedAt!: Date;
}

Report.init(
  {
    maBaoCao: {
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
      allowNull: false,
    },
    noiDungBaoCao: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  },
  {
    sequelize, // Đối tượng kết nối
    tableName: 'BaoCao',
    modelName: 'BaoCao',
    timestamps: false, // Sequelize sẽ tự động thêm `createdAt` và `updatedAt`
  }
);

export default Report;