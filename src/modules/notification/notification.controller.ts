import { NextFunction, Request, Response } from 'express';
import NotificationService from './notification.service';
import { console } from 'inspector';
import { uploadToCloudinary } from '../../config/cloudinary';
import INotification from './notification.interface';
// import { OTPData } from './users.interface';

export default class NotificationController {
  private NotificationService = new NotificationService();

  public getNotificationbyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await this.NotificationService.getNotificationbyUser(req.params.id)
      res.status(200).json(notification);
    } catch (error) {
      next(error);
    }
  };

  public getNotificationforRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deposit = await this.NotificationService.getNotificationforRoom(req.params.id)
      res.status(200).json(deposit);
    } catch (error) {
      next(error);
    }
  };


  public addNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: INotification = req.body;
      const result = await this.NotificationService.addNotification(data)
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public updateNotificationStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notificationId: number = req.body.maThongBao;
      const result = await this.NotificationService.updateNotificationStatus(notificationId)
      res.status(200).json({message: "Cập nhật trang thái thông báo thành công."});
    } catch (error) {
      next(error);
    }
  };


}

