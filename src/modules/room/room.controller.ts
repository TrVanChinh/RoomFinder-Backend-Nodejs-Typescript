import { NextFunction, Request, Response } from 'express';

// import RegisterDto from './dtos/register.dtos';
import RoomService from './room.service';
import { console } from 'inspector';
import { uploadToCloudinary } from '../../config/cloudinary';
// import { OTPData } from './users.interface';

export default class AddressController {
  private RoomService = new RoomService();

  public uploadRoomImages = async (req: Request, res: Response): Promise<void> => {
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

  public uploadRoomVideos = async (req: Request, res: Response): Promise<void> => {
    try {
      const { files } = req;

      // Kiểm tra kiểu của 'files'
      if (!files || !Array.isArray(files)) {
        res.status(400).json({ message: 'Cần ít nhất một video để tải lên' });
        return;
      }

      // Duyệt qua danh sách file để tải từng video lên Cloudinary
      const uploadedVideos = await Promise.all(
        files.map(async (file: Express.Multer.File) => {
          const uploadResult = await uploadToCloudinary(file.path, 'roomFinder/video_room');
          return uploadResult.url; // Lưu URL của video sau khi tải lên
        })
      );

      res.status(200).json({
        message: 'Video phòng trọ đã được tải lên thành công',
        data: uploadedVideos, // Trả về danh sách URL của các video
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Không thể tải lên video phòng trọ',
        error,
      });
    }
  };

  public getRoomType = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roomType = await this.RoomService.getRoomType();
      res.status(200).json(roomType);
    } catch (error) {
      next(error);
    }
  };
}

