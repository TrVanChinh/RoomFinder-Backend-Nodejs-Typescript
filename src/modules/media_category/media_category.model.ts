import { sequelize } from '../../config/connectDB';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import IMediaCategory from './media_category.interface'

interface MediaCategoryCreationAttributes extends Optional<IMediaCategory, 'maDanhMucHinhAnh'> {}

// Model MediaCategory
class MediaCategory extends Model<IMediaCategory, MediaCategoryCreationAttributes> implements IMediaCategory {
  public maDanhMucHinhAnh!: number; // Khóa chính, auto-increment
  public tenDanhMuc!: string;

  // Timestamps
  // public readonly createdAt!: Date;
  // public readonly updatedAt!: Date;
}

// Định nghĩa model
MediaCategory.init(
  {
    maDanhMucHinhAnh: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tenDanhMuc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize, // Đối tượng kết nối Sequelize
    tableName: 'DanhMucHinhAnh', // Tên bảng trong database
    modelName: 'DanhMucHinhAnh',
    timestamps: false, // Tự động thêm createdAt và updatedAt
  }
);

export default MediaCategory;