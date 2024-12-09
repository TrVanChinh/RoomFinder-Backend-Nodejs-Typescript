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

    // this.router.post(
    //   this.path + '/register',
    //   validationMiddleware(RegisterDto),
    //   this.UsersController.register);

    // this.router.post(
    //   this.path + '/login',
    //   this.UsersController.login);


  }
}