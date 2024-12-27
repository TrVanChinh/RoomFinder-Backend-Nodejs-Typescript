import { Route } from '../../core/interfaces';
import { Router } from 'express';
import NotificationController from './notification.controller';
import { authMiddleware } from '../../core/middlewave';
// import validationMiddleware from '@core/middleware/validation.middleware';

export default class NotificationRoute implements Route {
  public path = '/api/notification';
  public router = Router();
  public NotificationController = new NotificationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.get(
      this.path + '/user/:id' ,
      this.NotificationController.getNotificationbyUser);

    this.router.get(
      this.path + '/room/:id',
      this.NotificationController.getNotificationforRoom);
  

    this.router.post(
      this.path + '/addNew',
      this.NotificationController.addNotification);

    this.router.put(
    this.path + '/updateStatus',
    this.NotificationController.updateNotificationStatus);

  }
}