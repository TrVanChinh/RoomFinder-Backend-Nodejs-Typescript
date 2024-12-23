import { sequelize } from '../../config/connectDB';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import IMedia from './media.interface';

interface MediaCreationAttributes extends Optional<IMedia, 'maHinhAnh'> {}

// Định nghĩa model Media
class Media extends Model<IMedia, MediaCreationAttributes> implements IMedia {
  public maHinhAnh!: number;
  public maPhong!: number;
  public maDanhMucHinhAnh!: number;
  public loaiTep!: string;
  public duongDan!: string;

  // Timestamps
  // public readonly createdAt!: Date;
  // public readonly updatedAt!: Date;
}

// Khởi tạo model với Sequelize
Media.init(
  {
    maHinhAnh: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    maPhong: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maDanhMucHinhAnh: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    loaiTep: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duongDan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize, // Đối tượng kết nối
    tableName: 'HinhAnh',
    modelName: 'HinhAnh',
    timestamps: false,
  }
);

export default Media;