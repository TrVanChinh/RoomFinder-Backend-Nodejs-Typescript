import { IUser, TokenData } from '../auth';
import { isEmptyObject } from '../../core/utils';
import { generateJwtToken, randomTokenString } from '../../core/utils/helpers';

import { HttpException } from '../../core/exceptions';
import LoginDto from './auth.dto';
import { RefreshToken } from '../refresh_token';
import { UserSchema } from '../users';
import bcrypt from 'bcrypt';

class AuthService {
  public userSchema = UserSchema;

  public async adminLogin(model: LoginDto): Promise<TokenData> {
    if (isEmptyObject(model)) {
      throw new HttpException(400, 'Model is empty');
    }

    const user = await this.userSchema.findOne({ where: { email: model.email } });
    if (!user) {
      throw new HttpException(409, `Your email ${model.email} is not exist.`);
    }
    const isMatchPassword = await bcrypt.compare(model.matKhau, user.matKhau);
    if (!isMatchPassword) throw new HttpException(400, 'Credentials are not valid');
    if(user.maLTK ==3 || user.maLTK ==4) {
      throw new HttpException(401, 'Đăng nhập thất bại');
    }
    const refreshToken = await this.generateRefreshToken(user.maNguoiDung);
    const jwtToken = generateJwtToken(user.maNguoiDung, refreshToken.token);

    // Save refresh token to database
    await refreshToken.save();

    return jwtToken;
  }

  
  public async userLogin(model: LoginDto): Promise<IUser> {
    if (isEmptyObject(model)) {
      throw new HttpException(400, 'Dữ liệu đăng nhập trống.');
    }

    const user = await this.userSchema.findOne({ where: { email: model.email } });
    if (!user) {
      throw new HttpException(409, `Email: ${model.email} không tồn tại.`);
    }
    const isMatchPassword = await bcrypt.compare(model.matKhau, user.matKhau);
    if (!isMatchPassword) throw new HttpException(400, 'Thông tin đăng nhập không hợp lệ');
    if(user.maLTK ==1 || user.maLTK ==2) {
      throw new HttpException(401, 'Đăng nhập thất bại');
    }
    return user;
  }

  public async refreshToken(token: string): Promise<TokenData> {
    const refreshToken = await this.getRefreshTokenFromDb(token);
    const { maNguoiDung } = refreshToken; // Assuming `maNguoiDung` is the user id

    // Generate new refresh token
    const newRefreshToken = await this.generateRefreshToken(maNguoiDung);

    // Revoke old refresh token and associate it with the new token
    refreshToken.ngayThuHoi = new Date(); // Revoke the old token
    refreshToken.tokenThayThe = newRefreshToken.token;
    await refreshToken.save();
    // Save the new refresh token to the database
    await newRefreshToken.save();
    // Return JWT token with the new refresh token
    return generateJwtToken(maNguoiDung, newRefreshToken.token);
  }

  // Revoke a specific refresh token
  public async revokeToken(token: string): Promise<void> {
    const refreshToken = await this.getRefreshTokenFromDb(token);

    // Revoke the refresh token
    refreshToken.ngayThuHoi = new Date(); // Mark as revoked
    await refreshToken.save();
  }

  // Get the current logged-in user by user ID
  public async getCurrentLoginUser(userId: number): Promise<IUser> {
    const user = await this.userSchema.findByPk(userId); // Using Sequelize's findByPk for primary key search
    if (!user) {
      throw new HttpException(404, `User with ID ${userId} does not exist`);
    }
    return user;
  }

  // Helper function to fetch the refresh token from the database
  private async getRefreshTokenFromDb(refreshToken: string) {
    const token = await RefreshToken.findOne({
      where: { token: refreshToken },
      include: ['NguoiDung'] // Assuming 'user' is a relation defined in Sequelize
    });

    // Logger.info(token);
    if (!token || !token.isActive) {
      throw new HttpException(400, `Invalid refresh token`);
    }
    return token;
  }


  private async generateRefreshToken(userId: number) {
    // create a refresh token that expires in 7 days
    return RefreshToken.create({
      maNguoiDung: userId, // Đúng tên trường trong model
      token: randomTokenString(),
      ngayHetHan: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // in 7 days
      ngayTao: new Date(), // Ngày tạo là hiện tại
      trangThaiHoatDong: true, // Giá trị mặc định
      hetHan: false, // Giá trị mặc định

    });
  }

  
}

export default AuthService;