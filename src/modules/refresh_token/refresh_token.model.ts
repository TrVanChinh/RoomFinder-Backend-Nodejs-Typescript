import { sequelize } from '../../config/connectDB';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { IRefreshToken } from './refresh_token.interface';

interface RefreshTokenCreationAttributes extends Optional<IRefreshToken,'id' | 'ngayThuHoi' | 'tokenThayThe'> {}

class RefreshToken extends Model<IRefreshToken, RefreshTokenCreationAttributes> implements IRefreshToken {
    public id!: number; // Trường ID tự động tăng
    public maNguoiDung!: number; // Tham chiếu đến nguoiDung
    public token!: string;
    public ngayHetHan!: Date;
    public ngayTao!: Date;
    public ngayThuHoi!: Date | null;
    public tokenThayThe!: string | null;
    public trangThaiHoatDong!: boolean;
    public hetHan!: boolean;

    // Timestamps
    public get isExpired(): boolean {
        return Date.now() >= this.ngayHetHan.getTime();
      }
    
    public get isActive(): boolean {
    return !this.ngayThuHoi && !this.isExpired;
    }
    
}

RefreshToken.init(
    {
      id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        maNguoiDung: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'NguoiDung', 
                key: 'maNguoiDung', // Khóa chính trong bảng người dùng
            },
            onDelete: 'CASCADE', // Xóa các refresh token khi xóa người dùng
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ngayHetHan: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        ngayTao: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        ngayThuHoi: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        tokenThayThe: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        trangThaiHoatDong: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        hetHan: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: 'RefreshToken',
        tableName: 'RefreshToken', // Tên bảng trong cơ sở dữ liệu
        timestamps: true,
    }
);

export default RefreshToken;
