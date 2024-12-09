import { sequelize } from '../../config/connectDB';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import IUser from './users.interface';

interface UserCreationAttributes extends Optional<IUser, 'maNguoiDung'> {}

class User extends Model<IUser, UserCreationAttributes> implements IUser {
  public maNguoiDung!: number;
  public tenNguoiDung!: string;
  public gioiTinh!: string | null;
  public queQuan!: string | null;
  public email!: string;
  public matKhau!: string;
  public sdt!: string | null;
  public diaChi!: string | null;
  public hinhDaiDien!: string | null;
  public ngaySinh!: Date | null;
  public soCCCD!: string | null;
  public matTruocCCCD!: string | null;
  public matSauCCCD!: string | null;
  public maPX!: string | null;
  public maLTK!: number | null;
  public trangThaiDangKy!: string;
  public trangThaiTaiKhoan!: string | null;
  public ngayDangKy!: Date;
  public ngayCapNhat!: Date | null;
}

User.init(
  {
    maNguoiDung: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tenNguoiDung: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gioiTinh: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    queQuan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    matKhau: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sdt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    diaChi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hinhDaiDien: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ngaySinh: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    soCCCD: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    matTruocCCCD: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    matSauCCCD: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    maPX: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    maLTK: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    trangThaiDangKy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trangThaiTaiKhoan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ngayDangKy: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    ngayCapNhat: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    sequelize,
    modelName: 'NguoiDung',
    tableName: 'NguoiDung',
    timestamps: false,
  }
);

export default User;
