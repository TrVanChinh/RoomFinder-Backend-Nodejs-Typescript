import { IRole } from './role.interface';
import { sequelize } from '../../config/connectDB';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface IRoleCreationAttributes extends Optional<IRole, 'maLTK'> {}

class Role
  extends Model<IRole, IRoleCreationAttributes>
  implements IRole
{
  public maLTK!: number;
  public vaiTro!: string;

  // Timestamps
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
}
Role.init(
  {
    maLTK: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vaiTro: {
      type: DataTypes.STRING,
      allowNull: false,
    },
},
  {
    sequelize,
    modelName:'LoaiTaiKhoan',
    tableName: 'LoaiTaiKhoan',
    timestamps: false, // Nếu cần cột createdAt và updatedAt
  }
);

export default Role;