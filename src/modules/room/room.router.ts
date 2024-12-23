// import RegisterDto from './dtos/register.dtos';
import { Route } from '../../core/interfaces';
import { Router } from 'express';
import RoomController from './room.controller';
import { authMiddleware } from '../../core/middlewave';
import multer from "multer";
// import validationMiddleware from '@core/middleware/validation.middleware';

export default class RoomRoute implements Route {
  public path = '/api/room';
  public router = Router();
  public RoomController = new RoomController();
  public upload = multer({ dest: '../../uploads/' });

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
  
    this.router.post(
      this.path + '/upload/images',
      this.upload.array('roomImages', 10), // Tối đa 10 ảnh
      this.RoomController.uploadRoomImages);  

    this.router.post(
      this.path + '/upload/videos',
      this.upload.array('roomVideos', 2), // Giới hạn tối đa 2 video
      this.RoomController.uploadRoomVideos);

    this.router.get(
      this.path + '/type',
      this.RoomController.getRoomType);

    this.router.get(
      this.path + '/:id',
      this.RoomController.getRoom);
    
    this.router.get(
      this.path + '/user/:id',
      this.RoomController.getRoomOfUser);
    
    this.router.get(
      this.path + '/address/district',
      this.RoomController.getRoomOfDistrict);

    this.router.post(
      this.path + '/addNew',
      this.RoomController.addRoom);

    this.router.delete(
      this.path + '/delete/:id',
      this.RoomController.deleteRoom);
          
    this.router.put(
      this.path + '/updateStatus/:id',
      this.RoomController.updateRoomStatus);

    this.router.put(
      this.path + '/updateBasicRoomInfo',
      this.RoomController.updateBasicRoomInfo);
  }
}