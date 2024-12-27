import { NextFunction, Request, Response } from 'express';

import RegisterDto from './dtos/register.dtos';
import { TokenData } from '../auth';
import UserService from './users.service';
import { console } from 'inspector';
import { uploadToCloudinary } from '../../config/cloudinary';
import userUpdateByAdmin from './dtos/userUpdateByAdmin.dtos';
import { OTPData } from './users.interface';
import RegisterRoomOwnerDto from './dtos/registerRoomOwner.dtos';

import moment from'moment';
import axios from 'axios';
import CryptoJS from 'crypto-js'
import qs from "qs";
import { IReport } from '../report';

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

  public updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: { oldPassword: string, newPassword: string} = req.body;
      const userId: string = req.params.id
      const user = await this.userService.updatePassword(userId, data);
      res.status(200).json({message: "Cập nhật mật khẩu thành công."});
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

  public userUpdateByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: { maNguoiDung: number, tenNguoiDung: string, sdt: string, ngaySinh?: Date, hinhDaiDien: string } = req.body;
      const user = await this.userService.updateUserByUser(data);
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

  public payment = async (req: Request, res: Response): Promise<void> => { 
    const { totalPrice } = req.body;
    const config = {
      app_id: "2553",
      key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
      key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
      endpoint: "https://sb-openapi.zalopay.vn/v2/create",
    };
  
    const embed_data = { bankgroup: "ATM" };
  
    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: "user123",
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: totalPrice,
      description: `Đặt cọc phòng`,
      bank_code: "",
      mac:"",
    };
  
    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
      config.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
  
    axios
      .post(config.endpoint, null, { params: order })
      .then((response) => {
        // console.log(response.data);
        console.log(order.app_trans_id)
        res.json({ order_url: response.data.order_url, transID: order.app_trans_id});
      })
      .catch((err) => console.log(err));
  
  }

  public checkPayment = async (req: Request, res: Response): Promise<void> => { 
    const {transID} = req.body;
    const config = {
      app_id: "2553",
      key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
      key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
      endpoint: "https://sb-openapi.zalopay.vn/v2/query",
    };
  
    let postData = {
      app_id: config.app_id,
      app_trans_id: transID, // Input your app_trans_id
      mac:"",
    };
  
    let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
  
    let postConfig = {
      method: "post",
      url: config.endpoint,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify(postData),
    };
  
    axios(postConfig)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        res.json({ data: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  
  }

  public addReport = async (req: Request, res: Response,  next: NextFunction) => {
    try {
      const data: IReport = req.body;
      const result = await this.userService.addReport(data.maNguoiDung, data.maPhong, data.noiDungBaoCao);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}


