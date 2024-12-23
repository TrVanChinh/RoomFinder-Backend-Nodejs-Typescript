import { sequelize } from '../../config/connectDB';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import {IInterior} from './interior.interface';
import Room from '../room/room.model';

interface IInteriorCreationAttributes extends Optional<IInterior, 'maNoiThat'> {}

class Interior
  extends Model<IInterior, IInteriorCreationAttributes>
  implements IInterior
{
  public maNoiThat!: number;
  public dieuHoa!: boolean;
  public wifi!: boolean;
  public nongLanh!: boolean;
  public giuong!: boolean;
  public banGhe!: boolean;
  public sofa!: boolean;
  public chanGaGoi!: boolean;
  public tuLanh!: boolean;
  public doDungBep!: boolean;
  public tuQuanAo!: boolean;

  // Timestamps
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
}

// Khởi tạo model với Sequelize
Interior.init(
  {
    maNoiThat: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dieuHoa: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    nongLanh: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    wifi: { 
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    giuong: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    banGhe: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    sofa: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    chanGaGoi: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    tuLanh: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    doDungBep: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    tuQuanAo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName:'NoiThat',
    tableName: 'NoiThat',
    timestamps: false, // Nếu cần cột createdAt và updatedAt
  }
);
export default Interior;