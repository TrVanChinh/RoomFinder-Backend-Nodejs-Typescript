import { NextFunction, Request, Response } from 'express';

// import RegisterDto from './dtos/register.dtos';
import RoomService from './room.service';
import { console } from 'inspector';
import { uploadToCloudinary } from '../../config/cloudinary';
import  IRoom, { RoomSearchCriteria }  from './room.interface';

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

  public addRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: IRoom = req.body
      const result = await this.RoomService.addRoom(data)
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getRoom = async (req: Request, res: Response, next: NextFunction) => { 
    try {
      const room = await this.RoomService.getRoomInfo(req.params.id);
      res.status(200).json(room);
    } catch (error) {
      next(error);
    }
  }

  public getRoomOfUser = async (req: Request, res: Response, next: NextFunction) => { 
    try {
      const room = await this.RoomService.getRoomOfUser(req.params.id);
      res.status(200).json(room);
    } catch (error) {
      next(error);
    }
  }

  public getRoomOfDistrict = async (req: Request, res: Response, next: NextFunction) => { 
    try {
      const district = req.query.district as string;
      const room = await this.RoomService.getRoomOfDistrict(district);
      res.status(200).json(room);
    } catch (error) {
      next(error);
    }
  }

  public deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roomId: string = req.params.id;
      await this.RoomService.deleteRoom(roomId);
      res.status(200).json({ message: 'Phòng trọ đã được xóa thành công' });
    } catch (error) {
      next(error);
    }
  }

  public updateRoomStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const  maPhong  = req.params.id; 
        const trangThaiPhong  = req.body.trangThaiPhong; 
        const data = await this.RoomService.updateRoomStatus(maPhong, trangThaiPhong);
        res.status(200).json(data);

    } catch (error) {
        next(error);
    }
  };

  public updateBasicRoomInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roomData: IRoom  = req.body; 
        await this.RoomService.updateBasicRoomInfo(roomData);
        res.status(200).json({
            message: 'Cập nhật thông tin phòng thành công.',
        });
    } catch (error) {
        next(error);
    }
  };

  public searchRooms = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roomData: RoomSearchCriteria  = req.body; 
        const data = await this.RoomService.searchRooms(roomData);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
  };

}

