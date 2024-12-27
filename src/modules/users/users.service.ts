import { DataStoredInToken } from './../auth/auth.interface';
import IUser from './users.interface';
import RegisterDto from './dtos/register.dtos';
import { TokenData } from '../auth';
import User from './users.model';
import Role from '../role/role.model';
import bcrypt from 'bcrypt';
import gravatar from 'gravatar'
import { isEmptyObject } from '../../core/utils';
import jwt from 'jsonwebtoken';
import { HttpException } from '../../core/exceptions';
import { Sequelize,  Op } from 'sequelize'; 
import { IPagination } from '../../core/interfaces';
import userUpdateByAdmin from './dtos/userUpdateByAdmin.dtos';
import { OTPData } from './users.interface';
import RegisterRoomOwnerDto from './dtos/registerRoomOwner.dtos';
import { IsEmail, IsNotEmpty, validate } from 'class-validator';
import { IReport } from '../report';
import Report from '../report/report.model';
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
})


class UserService {

    // public async createUser(model: RegisterDto): Promise<TokenData> {
    //     // Mã hóa mật khẩu người dùng trước khi lưu trữ
    //     const hashedPassword = await bcrypt.hash(model.matKhau, 10);

    //     const avatar = gravatar.url(model.email!, {
    //       size: '200',
    //       rating: 'g',
    //       default: 'mm',
    //     });
    //     // Tạo người dùng mới bằng Sequelize
    //     const user = await User.create({
    //       tenNguoiDung: model.tenNguoiDung,     
    //       email: model.email,
    //       matKhau: hashedPassword,
    //       gioiTinh: null, 
    //       queQuan: null, 
    //       sdt: null, 
    //       diaChi: null, 
    //       hinhDaiDien: avatar, 
    //       ngaySinh: null, 
    //       soCCCD: null, 
    //       maTruocCCCD: null, 
    //       maSauCCCD: null, 
    //       maPX: null, 
    //       maLTK: 4, 
    //       trangThaiDangKy: "Đã duyệt", 
    //       trangThaiTaiKhoan: "Đang hoạt động", 
    //       ngayDangKy: new Date(),
    //       ngayCapNhat: new Date(),
    //     });
    
    //     // Tạo JWT token sau khi người dùng được tạo
    //     const token = jwt.sign(
    //       { id: user.maNguoiDung, email: user.email },
    //       process.env.JWT_TOKEN_SECRET!,
    //       { expiresIn: '1h' }
    //     );
    
    //     return {
    //       token: token,
    //     //   user: user, // Trả về thông tin người dùng nếu cần
    //     };
    //   }
    
    public async createUser(model: RegisterDto): Promise<TokenData> {
      // Mã hóa mật khẩu người dùng trước khi lưu trữ
      const checkEmailExist = await User.findOne({
        where: {
          email: model.email,
        }
      });
      if (checkEmailExist) {
        throw new HttpException(400, 'Email đã tồn tại.');
      }

      const hashedPassword = await bcrypt.hash(model.matKhau, 10);
      
      const user = await User.create({
        tenNguoiDung: model.tenNguoiDung,     
        email: model.email,
        matKhau: hashedPassword,
        gioiTinh: null, 
        queQuan: null, 
        sdt: null, 
        maDiaChi: null, 
        hinhDaiDien: "https://www.gravatar.com/avatar/c4c3dab67de42ddbbfeec8c32284a1d6?size=200&rating=g&default=mm", 
        ngaySinh: null, 
        soCCCD: null, 
        matTruocCCCD: null, 
        matSauCCCD: null, 
        maPX: null, 
        maLTK: 4, 
        trangThaiDangKy: "Đã duyệt", 
        trangThaiTaiKhoan: "Đang hoạt động", 
        ngayDangKy: new Date(),
        ngayCapNhat: new Date(),
      });
  
      // Tạo JWT token sau khi người dùng được tạo
      const token = jwt.sign(
        { id: user.maNguoiDung, email: user.email },
        process.env.JWT_TOKEN_SECRET!,
        { expiresIn: '1h' }
      );
  
      return {
        token: token,
      //   user: user, // Trả về thông tin người dùng nếu cần
      };
    }
    
      public async createRoomOwner(model: RegisterRoomOwnerDto): Promise<TokenData> {
        if (isEmptyObject(model)) {
          throw new HttpException(400, 'Không để trống');
        }
        const checkEmailExist = await User.findOne({
          where: {
            email: model.email,
          }
        });
        if (checkEmailExist) {
          throw new HttpException(400, 'Email đã tồn tại.');
        }
        const hashedPassword = await bcrypt.hash(model.matKhau, 10);
        // Tạo người dùng mới bằng Sequelize
        const user = await User.create({
          tenNguoiDung: model.tenNguoiDung,     
          email: model.email,
          matKhau: hashedPassword,
          gioiTinh: null, 
          queQuan: null, 
          sdt: model.sdt, 
          maDiaChi: null, 
          hinhDaiDien: "https://www.gravatar.com/avatar/c4c3dab67de42ddbbfeec8c32284a1d6?size=200&rating=g&default=mm", 
          ngaySinh: null, 
          soCCCD: model.soCCCD, 
          matTruocCCCD: model.matTruocCCCD, 
          matSauCCCD: model.matSauCCCD,  
          maPX: null, 
          maLTK: 3, 
          trangThaiDangKy: "Chưa duyệt", 
          trangThaiTaiKhoan: "Chưa hoạt động",
          ngayDangKy: new Date(),
          ngayCapNhat: new Date(),
        });
    
        // Tạo JWT token sau khi người dùng được tạo
        const token = jwt.sign(
          { id: user.maNguoiDung, email: user.email },
          process.env.JWT_TOKEN_SECRET!,
          { expiresIn: '1h' }
        );
    
        return {
          token: token,
        //   user: user, // Trả về thông tin người dùng nếu cần
        };
      }

      public async checkRegistrationInformation(model: RegisterRoomOwnerDto) {
        try {
          if (!/^[a-z0-9.]+@gmail\.com$/.test(model.email)) { 
            throw new HttpException(400, 'Email không hợp lệ.');
        }

          const checkEmailExist = await User.findOne({
            where: {
              email: model.email,
            },
          });
      
          if (checkEmailExist) {
            throw new HttpException(400, 'Email đã tồn tại.');
          }

          const checkSDTExist = await User.findOne({
            where: {
              sdt: model.sdt,
            },
          });
      
          if (checkSDTExist) {
            throw new HttpException(400, 'Số điện thoại đã được sử dụng.');
          }

          const checkIDCardExist = await User.findOne({
            where: {
              soCCCD: model.soCCCD,
            },
          });
      
          if (checkIDCardExist) {
            throw new HttpException(400, 'Căn cước công dân đã được sử dụng.');
          }

      } catch (error) {
        console.log(error);
        if (error instanceof HttpException) {
          throw error;
        }
        throw new HttpException(500, 'Lỗi khi kiểm tra thông tin đăng ký.');
      }
    }
      public async sendOTPVerificationEmail(email: string): Promise<string> {
        try {
          if (!/^[a-z0-9.]+@gmail\.com$/.test(email)) { 
            throw new HttpException(400, 'Email không hợp lệ.');
        }
          const checkEmailExist = await User.findOne({
            where: {
              email: email,
            },
          });
      
          if (checkEmailExist) {
            throw new HttpException(400, 'Email đã tồn tại.');
          }
      
          // Tạo mã OTP gồm 6 chữ số
          const otp = `${Math.floor(10000 + Math.random() * 90000)}`; 
      
          // Tùy chọn gửi email
          const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'Xác minh OTP',
            html: `<p>Mã OTP của bạn: <b>${otp}</b></p>`,
          };
      
          // Mã hóa OTP
          const saltRounds = 10;
          const hashedOTP = await bcrypt.hash(otp, saltRounds);
      
          await transporter.sendMail(mailOptions);
          return hashedOTP
        } catch (error) {
          // Nếu lỗi đã là HttpException, giữ nguyên thông báo
          if (error instanceof HttpException) {
            throw error;
          }
          // Nếu lỗi khác, ném lỗi mặc định
          throw new HttpException(500, 'Lỗi khi gửi OTP');
        }
      }
        public async verifyOTP(model:OTPData, modelUser: RegisterDto) { 
        try {
          if (model.otp=="" || model.hashedOTP=="") {
            throw new HttpException(400, 'Không để trống');
          }
          const validOTP = await bcrypt.compare(model.otp, model.hashedOTP);
          if(!validOTP) {
            throw new HttpException(400, 'OTP không hợp lệ. Kiểm tra hộp thư đến của bạn!');
          }
            return await this.createUser(modelUser);
        } catch (error) {
          console.log(error)
          if (error instanceof HttpException) {
            throw error;
          }
          throw new HttpException(500, 'Lỗi xác minh OTP');
        }
      }

      public async verifyOTPbyRoomOwner(model:OTPData, modelUser: RegisterRoomOwnerDto) { 
        try {
          if (model.otp=="" || model.hashedOTP=="") {
            throw new HttpException(400, 'Không để trống');
          }
          const validOTP = await bcrypt.compare(model.otp, model.hashedOTP);
          if(!validOTP) {
            throw new HttpException(400, 'OTP không hợp lệ. Kiểm tra hộp thư đến của bạn!');
          }
            return await this.createRoomOwner(modelUser);
        } catch (error) {
          console.log(error)
          if (error instanceof HttpException) {
            throw error;
          }
          throw new HttpException(500, 'Lỗi xác minh OTP');
        }
      }

      // public async userUpdateByAdmin(userId: string, model: userUpdateByAdmin): Promise<User> {
      //   if (isEmptyObject(model)) {
      //     throw new HttpException(400, 'Model is empty');
      //   }
    
      //   // Tìm người dùng theo userId
      //   const user = await User.findByPk(userId);
      //   if (!user) {
      //     throw new HttpException(400, 'User does not exist');
      //   }
    
      //   // Kiểm tra email đã được dùng bởi người dùng khác chưa
      //   const checkEmailExist = await User.findOne({
      //     where: {
      //       email: model.email,
      //       maNguoiDung: { [Op.ne]: userId }  // Email trùng nhưng id khác
      //     }
      //   });
      //   if (checkEmailExist) {
      //     throw new HttpException(400, 'Email is already in use by another user');
      //   }
    
      //   // Cập nhật mật khẩu nếu người dùng cung cấp mật khẩu mới
      //   let updateData: Partial<User> = { ...model };
      //   if (model.matKhau) {
      //     const hashedPassword = await bcrypt.hash(model.matKhau, 10);
      //     updateData.matKhau = hashedPassword;
      //   }
    
      //   // Cập nhật thông tin người dùng
      //   await user.update(updateData);
    
      //   return user;
      // }

      public async updatePassword(userId: string, data: { oldPassword: string, newPassword: string}) {
        try {
          const user = await User.findByPk(userId)
          if (!user) {
            throw new HttpException(400, 'Người dùng này không tồn tại.');
          }
          if (data.oldPassword.length < 7 || data.newPassword.length < 7) {
            throw new HttpException(400, 'Mật khẩu không hợp lệ.');
          }
          const validPassword = await bcrypt.compare(data.oldPassword, user.matKhau);
          if (!validPassword) {
            throw new HttpException(400, 'Mật khẩu không chính xác.');
          }
          const hashedPassword = await bcrypt.hash(data.newPassword, 10);
          user.matKhau = hashedPassword;
          await user.save();

        } catch (error) {
          console.log(error)
          if (error instanceof HttpException) {
            throw error;
          }
          throw new HttpException(500, 'Lỗi cập nhật mật khẩu');
        }
      }
        

      public async userUpdateByAdmin(userId: string, model: userUpdateByAdmin): Promise<User> {
        if (isEmptyObject(model)) {
          throw new HttpException(400, 'Dữ liệu rỗng');
        }
    
        // Tìm người dùng theo userId
        const user = await User.findByPk(userId);
        if (!user) {
          throw new HttpException(400, 'Người dùng này không tồn tại.');
        }
    
        // Kiểm tra email đã được dùng bởi người dùng khác chưa
        const checkEmailExist = await User.findOne({
          where: {
            email: model.email,
            maNguoiDung: { [Op.ne]: userId }  // Email trùng nhưng id khác
          }
        });
        if (checkEmailExist) {
          throw new HttpException(400, 'Email is already in use by another user');
        }
    
        // Cập nhật mật khẩu nếu người dùng cung cấp mật khẩu mới
        let updateData: Partial<User> = {};
        updateData.tenNguoiDung = model.tenNguoiDung;
        updateData.email = model.email;
        updateData.sdt = model.sdt;
        updateData.gioiTinh = model.gioiTinh;
        updateData.soCCCD = model.soCCCD;
        updateData.trangThaiTaiKhoan = model.trangThaiTaiKhoan;
        updateData.trangThaiDangKy = model.trangThaiDangKy;
        updateData.maLTK  = model.maLTK
        updateData.ngaySinh = model.ngaySinh
        // Cập nhật thông tin người dùng
        await user.update(updateData);
    
        return user;
      }

      public async updateUserByUser(data: { maNguoiDung: number, tenNguoiDung: string, sdt: string, ngaySinh?: Date, hinhDaiDien:string }) {
        if (!data) {
            throw new HttpException(400, 'Dữ liệu người dùng không hợp lệ.');
        }
        try {
            const user = await User.findByPk(data.maNguoiDung); 
 
            if (!user) {
                throw new HttpException(404, 'Không tìm thấy người dùng.');
            }

            if(data.sdt.length!=10)
            {
                throw new HttpException(400, 'Số điện thoại không hợp lệ.');
            }

            if(user.sdt !== data.sdt) {
              const checkSDTExist = await User.findOne({
                where: {
                  sdt: data.sdt,
                },
              });
              if (checkSDTExist) {
                throw new HttpException(400, 'Số điện thoại đã được sử dụng.');
              }
            }
      
            if (data.hinhDaiDien) {
                user.hinhDaiDien = data.hinhDaiDien;
            }
            if (data.tenNguoiDung) {
                user.tenNguoiDung = data.tenNguoiDung;
            }
            if (data.sdt) {
                user.sdt = data.sdt;
            }
            if (data.ngaySinh) {
                user.ngaySinh = data.ngaySinh;
            }
            user.ngayCapNhat = new Date();

            await user.save();
            return user;
        } catch (error) {
            console.log(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, 'Lỗi cập nhật người dùng.');
        }
    }
    
      public async addUserByAdmin( model: userUpdateByAdmin): Promise<User> {
    
        if (isEmptyObject(model)) {
          throw new HttpException(400, 'Model is empty');
        }
        const checkEmailExist = await User.findOne({
          where: {
            email: model.email,
          }
        });
        if (checkEmailExist) {
          throw new HttpException(400, 'Email is already in use by another user');
        }
    
        const hashedPassword = await bcrypt.hash(model.matKhau, 10);

        // Tạo người dùng mới bằng Sequelize
        const user = await User.create({
          tenNguoiDung: model.tenNguoiDung,     
          email: model.email,
          matKhau: hashedPassword,
          gioiTinh: model.gioiTinh, 
          queQuan: null, 
          sdt: model.sdt, 
          maDiaChi: null, 
          hinhDaiDien: null, 
          ngaySinh: model.ngaySinh, 
          soCCCD: model.soCCCD, 
          matTruocCCCD: null, 
          matSauCCCD: null, 
          maPX: null, 
          maLTK: model.maLTK, 
          trangThaiDangKy: "Đã duyệt", 
          trangThaiTaiKhoan: model.trangThaiTaiKhoan, 
          ngayDangKy: new Date(),
          ngayCapNhat: new Date(),
        });        
    
        return user;
      }

    public async getUserById(userId: string): Promise<IUser> {
      const user = await User.findByPk(userId); // Sử dụng findByPk của Sequelize để tìm theo primary key
      if (!user) {
        throw new HttpException(404, 'User does not exist');
      }
      return user;
    }

    public async getUserByMaLTK(maLTK: string): Promise<IUser> {
      const user = await User.findByPk(maLTK); // Sử dụng findByPk của Sequelize để tìm theo primary key
      if (!user) {
        throw new HttpException(404, 'User does not exist');
      }
      return user;
    }

    // Lấy tất cả người dùng
    public async getAll(): Promise<IUser[]> {
      const users = await User.findAll(); // Sử dụng findAll của Sequelize để lấy tất cả người dùng
      return users;
    }

    
    public  getRoleAll= async() => {
      const roles = await Role.findAll(); 
      return roles;
    }

    public async deleteUser(userId: string): Promise<User> {
      const deletedUser = await User.findOne({ where: { maNguoiDung: userId } });
      if (!deletedUser) {
        throw new HttpException(409, 'Your id is invalid');
      }
      await deletedUser.destroy(); // Xoá người dùng này khỏi database
      return deletedUser;
    }
  
    public async deleteUsers(userIds: number[]): Promise<number> {
      const result = await User.destroy({
        where: {
          maNguoiDung: {
            [Op.in]: userIds,
          },
        },
      });
      if (result === 0) {
        throw new HttpException(409, 'Your id is invalid');
      }
      return result; 
    }
  
    public async getAllPaging(keyword: string, page: number): Promise<IPagination<IUser>> {
      const pageSize: number = Number(process.env.PAGE_SIZE || 10);
      // Tạo điều kiện tìm kiếm nếu có keyword
      let whereCondition = {}
      if (keyword) { 
        whereCondition = keyword
        ? {
            [Op.or]: [
              // { maLTK: { [Op.eq]: parseInt(keyword)} },
              { tenNguoiDung: { [Op.iLike]: `%${keyword}%` } },
              { email: { [Op.iLike]: `%${keyword}%` } },
            ]
        }
        : {};
      }
      
      // Lấy danh sách người dùng với phân trang
      const { rows: users, count: rowCount } = await User.findAndCountAll({
          where: whereCondition,
          offset: (page - 1) * pageSize,
          limit: pageSize,
      });
  
      return {
          total: rowCount,
          page: page,
          pageSize: pageSize,
          items: users,
      } as IPagination<IUser>;
  }
  
  public async getAllPaginationByRole(roleId: number, page: number): Promise<IPagination<IUser>> {
    const pageSize: number = Number(process.env.PAGE_SIZE || 10);
    // Tạo điều kiện tìm kiếm nếu có keyword
    let whereCondition = {}
    if (roleId) { 
      whereCondition = roleId
      ? {
          [Op.or]: [
            { maLTK: { [Op.eq]: roleId} },
          ]
      }
      : {};
    }
    
    // Lấy danh sách người dùng với phân trang
    const { rows: users, count: rowCount } = await User.findAndCountAll({
        where: whereCondition,
        offset: (page - 1) * pageSize,
        limit: pageSize,
    });

    return {
        total: rowCount,
        page: page,
        pageSize: pageSize,
        items: users,
    } as IPagination<IUser>;
}

  public updateUserCCCD = async (userId: number, frontUrl: string, backUrl: string) => {
    return await User.update(
      { matTruocCCCD: frontUrl, matSauCCCD: backUrl },
      { where: { maNguoiDung: userId } }
    );
  };

  public async addReport(userId: number, roomId: number, content: string): Promise<IReport> {
    if (!userId || !roomId || !content) {
        throw new HttpException(404, 'Thiếu dữ liệu báo cáo.');
    }
    try {
        const report = await Report.create({
            maNguoiDung: userId,
            maPhong: roomId,
            noiDungBaoCao: content,
        });
        return report;
    } catch (error) {
        console.error(error);
        if (error instanceof HttpException) {
            throw error;
        }
        throw new HttpException(500, 'Lỗi tạo báo cáo.');
    }
}

  

  
    // private createToken(user: IUser): TokenData {
    //   const dataInToken: DataStoredInToken = { id: user._id };
    //   const secret: string = process.env.JWT_TOKEN_SECRET!;
    //   const expiresIn: number = 3600;
    //   return {
    //     token: jwt.sign(dataInToken, secret, { expiresIn: expiresIn }),
    //   };
    // }
  
 }

export default UserService;