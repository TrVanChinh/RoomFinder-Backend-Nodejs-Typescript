import { NextFunction, Request, Response } from 'express';

// import RegisterDto from './dtos/register.dtos';
import MediaService from './media.service';
import { console } from 'inspector';
import { uploadToCloudinary } from '../../config/cloudinary';
import IMedia from './media.interface';
// import { OTPData } from './users.interface';

export default class MediaController {
  private MediaService = new MediaService();
  
  public uploadAvatar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { files } = req;
  
      // Kiểm tra nếu không có file ảnh nào
      if (!files || !Array.isArray(files) || files.length !== 1) {
        res.status(400).json({ message: 'Cần ít nhất một ảnh đại diện để tải lên' });
        return;
      }
  
      // Duyệt qua danh sách file và tải ảnh lên Cloudinary
      const uploadedAvatar = await uploadToCloudinary(files[0].path, 'roomFinder/avatar'); // Tải lên Cloudinary với folder 'avatar'
  
      res.status(200).json({
        message: 'Ảnh đại diện đã được tải lên thành công',
        data: uploadedAvatar.url, // Trả về URL của ảnh đại diện
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Không thể tải lên ảnh đại diện',
        error,
      });
    }
  };
  public getMediaOfRoom = async (req: Request, res: Response): Promise<void> => {
    try {
      const { files } = req;

      // Kiểm tra kiểu của 'files'
      if (!files || !Array.isArray(files)) {
        res.status(400).json({ message: 'Cần ít nhất một ảnh để tải lên' });
        return;
      }

      // Duyệt qua danh sách file để tải từng ảnh lên Cloudinary
      const uploadedImages = await Promise.all(
        files.map(async (file: Express.Multer.File) => {
          const uploadResult = await uploadToCloudinary(file.path, 'roomFinder/image');
          return uploadResult.url; // Lưu URL của ảnh sau khi tải lên
        })
      );

      res.status(200).json({
        message: 'Ảnh phòng trọ đã được tải lên thành công',
        data: uploadedImages, // Trả về danh sách URL của các ảnh
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Không thể tải lên ảnh phòng trọ',
        error,
      });
    }
  };

  public addMediaOfRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: string[] = req.body.data;
      const maPhong: number = req.body.maPhong;
      const maDanhMucHinhAnh: number = req.body.maDanhMucHinhAnh;
      const loaiTep: string = req.body.loaiTep;

      const result = await this.MediaService.addMediaOfRoom(maPhong, maDanhMucHinhAnh, loaiTep, data)
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public addMedia = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: IMedia= req.body;
      const result = await this.MediaService.addMedia(data)
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public deleteMedia = async (req: Request, res: Response, next: NextFunction) => { 
    try {
      const maHinhAnh: string = req.params.id;
      const result = await this.MediaService.deleteMediaOfRoom(maHinhAnh);
      res.status(200).json({message:"Xóa ảnh/video thành công."});
    } catch (error) {
      next(error);
    }
  }

  public updateMediaOfRoom = async (req: Request, res: Response, next: NextFunction) => { 
    try {
      const mediaDelete: IMedia[] = req.body.mediaDelete;
      const mediaCreate: IMedia[] = req.body.mediaCreate;
      const result = await this.MediaService.updateMediaofRoom(mediaDelete, mediaCreate);
      res.status(200).json({ message:"Cập nhật hình ảnh phòng thành công."});
    } catch (error) {
      next(error);
    }
  }
  public updateAvatar = async (req: Request, res: Response, next: NextFunction) => { 
    try {
      const Avataruri: string = req.body;
      const userId: string = req.params.id;
      const result = await this.MediaService.updateAvatar(userId, Avataruri);
      res.status(200).json({ message:"Cập nhật hình ảnh phòng thành công."});
    } catch (error) {
      next(error);
    }
  }

}

