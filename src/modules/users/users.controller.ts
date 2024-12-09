import { NextFunction, Request, Response } from 'express';

import RegisterDto from './dtos/register.dtos';
import { TokenData } from '../auth';
import UserService from './users.service';
import { console } from 'inspector';
import { uploadToCloudinary } from '../../config/cloudinary';
import userUpdateByAdmin from './dtos/userUpdateByAdmin.dtos';
import { OTPData } from './users.interface';
import RegisterRoomOwnerDto from './dtos/registerRoomOwner.dtos';

interface MulterRequest extends Request {
  files: {
    maTruocCCCD?: Express.Multer.File[];
    maSauCCCD?: Express.Multer.File[];
  };
}

export default class UsersController {
  private userService = new UserService();

  public sendOTPVerificationEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email }: { email: string } = req.body;
      const TokenData = await this.userService.sendOTPVerificationEmail(email);
      res.status(201).json(TokenData);
    } catch (error) {
      next(error);
    }
  };

  public checkRegistrationInfomation = async (req: Request, res: Response, next: NextFunction) => { 
    try {
          const dataUser: RegisterRoomOwnerDto  = req.body;
          console.log(dataUser)
          const result = await this.userService.checkRegistrationInformation(dataUser);
          res.status(200).json(result);
        } catch (error) {
          next(error);
        }
  }

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { otp, hashedOTP, user } = req.body.data; 
      const dataOTP: OTPData = { otp, hashedOTP };
      const dataUser: RegisterDto = user;
      const TokenData = await this.userService.verifyOTP(dataOTP, dataUser);
      res.status(201).json(TokenData);
    } catch (error) {
      next(error);
    }
  };

  public registerRoomOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { otp, hashedOTP, user } = req.body.data; 
      const dataOTP: OTPData = { otp, hashedOTP };
      const dataUser: RegisterRoomOwnerDto = user;
      const TokenData = await this.userService.verifyOTPbyRoomOwner(dataOTP, dataUser);
      res.status(201).json(TokenData);
    } catch (error) {
      next(error);
    }
  };

  public addUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: userUpdateByAdmin = req.body;
      const TokenData = await this.userService.addUserByAdmin(model);
      res.status(201).json(TokenData);
    } catch (error) {
      console.log(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAll();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };
  
  public getRoleAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roles = await this.userService.getRoleAll();
      res.status(200).json(roles);
    } catch (error) {
      next(error);
    }
  };

  public getAllPaging = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.params.page);
      const keyword = req.query.keyword || '';

      const paginationResult = await this.userService.getAllPaging(keyword.toString(), page);
      res.status(200).json(paginationResult);
    } catch (error) {
      next(error);
    }
  };

  public getAllPaginationByRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.params.page);
      const keyword = Number(req.query.keyword) || 0;

      const paginationResult = await this.userService.getAllPaginationByRole(keyword, page);
      res.status(200).json(paginationResult);
    } catch (error) {
      next(error);
    }
  };

  public userUpdateByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: userUpdateByAdmin = req.body;
      const user = await this.userService.userUpdateByAdmin(req.params.id, model);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.deleteUser(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public deleteUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("gui vao:",req.body)
      const ids: number[] = req.body;
      const result = await this.userService.deleteUsers(ids);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };


  // public uploadIDImages = async (req: MulterRequest, res: Response) =>{
  //   try {
  //     const userId = Number(req.params.id);

  //     // Lấy các file mặt trước và mặt sau từ req.files
  //     const frontFile = req.files.maTruocCCCD?.[0];
  //     const backFile = req.files.maSauCCCD?.[0];

  //     // Kiểm tra xem file có tồn tại không
  //     if (!frontFile || !backFile) {
  //       return res.status(400).json({ message: 'Both front and back images are required' });
  //     }

  //     // Tải lên Cloudinary
  //     const frontUpload = await uploadToCloudinary(frontFile.path);
  //     const backUpload = await uploadToCloudinary(backFile.path);

  //     // Cập nhật thông tin trong cơ sở dữ liệu
  //     const updateResult = await this.userService.updateUserCCCD(userId, frontUpload.url, backUpload.url);

  //     res.status(200).json({
  //       message: 'CCCD images uploaded and updated successfully',
  //       data: updateResult,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({
  //       message: 'Failed to upload CCCD images',
  //       error,
  //     });
  //   }
  // }

  public uploadIDImages = async (req: Request, res: Response): Promise<void> => {
    try {
      const { files } = req;

      // Kiểm tra kiểu của 'files' và ép kiểu về dạng đối tượng
      if (!files || typeof files !== 'object') {
        res.status(400).json({ message: 'Cần có cả hình ảnh mặt trước và mặt sau' });
        return ;
      }

      // Ép kiểu 'files' thành kiểu đối tượng với các trường mong muốn
      const typedFiles = files as { [key: string]: Express.Multer.File[] };

      const frontFile = typedFiles.matTruocCCCD ? typedFiles.matTruocCCCD[0] : undefined;
      const backFile = typedFiles.matSauCCCD ? typedFiles.matSauCCCD[0] : undefined;

      if (!frontFile || !backFile) {
        res.status(400).json({ message: 'Cần có cả hình ảnh mặt trước và mặt sau' });
        return ;
      }

       // Tải lên Cloudinary
      const frontUpload = await uploadToCloudinary(frontFile.path, 'roomFinder/image');
      const backUpload = await uploadToCloudinary(backFile.path, 'roomFinder/image');

      // Cập nhật thông tin trong cơ sở dữ liệu
      // const userId = Number(req.params.id);
      // const updatedUser = await this.userService.updateUserCCCD(userId, frontUpload.url, backUpload.url);

      res.status(200).json({
        message: 'Hình ảnh CCCD được tải lên thành công',
        data: {
          matTruocCCCD: frontUpload.url,
          matSauCCCD: backUpload.url,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Không thể tải lên hình ảnh CCCD',
        error,
      });
    }
  };
}
