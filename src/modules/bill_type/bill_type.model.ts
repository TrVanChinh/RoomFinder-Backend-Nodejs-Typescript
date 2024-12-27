import { sequelize } from '../../config/connectDB';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import IBiilType from './bill_type.interface'

interface BiilTypeCreationAttributes extends Optional<IBiilType, 'maLoaiHoaDon'> {}
class BiilType extends Model<IBiilType, BiilTypeCreationAttributes> implements IBiilType {
  public maLoaiHoaDon!: number; 
  public tenLoaiHoaDon!: string;

  // Timestamps
  // public readonly createdAt!: Date;
  // public readonly updatedAt!: Date;
}

BiilType.init(
  {
    maLoaiHoaDon: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tenLoaiHoaDon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'LoaiHoaDon',
    modelName: 'LoaiHoaDon',
    timestamps: false, 
  }
);

export default BiilType;