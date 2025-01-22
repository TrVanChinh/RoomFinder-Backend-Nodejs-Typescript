// import RegisterDto from './dtos/register.dtos';
import { Route } from '../../core/interfaces';
import { Router } from 'express';
import RoomController from './room.controller';
import { authMiddleware } from '../../core/middlewave';
import multer from "multer";
// import validationMiddleware from '@core/middleware/validation.middleware';
import { Server } from "socket.io";

export default class RoomRoute implements Route {
  public path = '/api/room';
  public router = Router();
  private RoomController: RoomController;
  public upload = multer({ dest: '../../uploads/' });

  constructor(io: Server) {
    this.RoomController = new RoomController(io); 
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
      this.path + '/saveroom/user/:id',
      this.RoomController.getRoomSaveOfUser);

    this.router.get(
      this.path + '/reportroom/:page',
      this.RoomController.getReportedRooms);

    this.router.get(
      this.path + '/address/district',
      this.RoomController.getRoomOfDistrict);

    this.router.get(
      this.path + '/paging/:page',
      this.RoomController.getAllRoomsPaging);
  
    this.router.get(
      this.path + '/revenueStatistics/user/:id',
      this.RoomController.revenueStatistics);

    this.router.post(
      this.path + '/type/paging/:page',
      this.RoomController.getAllRoomsByType);
  
    this.router.get(
      this.path + '/register/paging',
      this.RoomController.getAllRoomsRegister);

    this.router.post(
      this.path + '/addNew',
      this.RoomController.addRoom);
    
    this.router.post(
      this.path + '/chatbot/searchRooms',
      this.RoomController.searchRooms);

    this.router.post(
      this.path + '/saveroom',
      this.RoomController.saveRoom);

    this.router.delete(
      this.path + '/delete/:id',
      this.RoomController.deleteRoom);
          
    this.router.put(
      this.path + '/updateStatus/:id',
      this.RoomController.updateRoomStatus);

    this.router.put(
      this.path + '/approveRoom/:id',
      this.RoomController.approveRoom);

    this.router.put(
      this.path + '/rejectRoom/:id',
      this.RoomController.rejectRoom);

    this.router.put(
      this.path + '/updateBasicRoomInfo',
      this.RoomController.updateBasicRoomInfo);

    this.router.get(
      this.path + '/check/billdeadline',
      this.RoomController.checkAndNotifyExpiredBills);
  }
}