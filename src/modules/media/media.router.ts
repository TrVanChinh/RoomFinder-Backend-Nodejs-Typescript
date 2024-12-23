// import RegisterDto from './dtos/register.dtos';
import { Route } from '../../core/interfaces';
import { Router } from 'express';
import MediaController from './media.controller';
import { authMiddleware } from '../../core/middlewave';
import multer from "multer";
// import validationMiddleware from '@core/middleware/validation.middleware';

export default class MediaRouter implements Route {
  public path = '/api/media';
  public router = Router();
  public MediaController = new MediaController();
  public upload = multer({ dest: '../../uploads/' });

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.get(
      this.path + '/room',
      this.MediaController.getMediaOfRoom);

    this.router.post(
      this.path + '/upload/avatar',
      this.upload.array('avatar', 1),
      this.MediaController.uploadAvatar)

    this.router.post(
      this.path + '/addNew',
      this.MediaController.addMediaOfRoom);
    
    this.router.post(
      this.path + '/addMedia',
      this.MediaController.addMedia);

    this.router.delete(
      this.path + '/delete/:id',
      this.MediaController.deleteMedia);
    
    this.router.put(
      this.path + '/updateMediaOfRoom',
      this.MediaController.updateMediaOfRoom);

      this.router.put(
        this.path + '/updateAvatar/user/:id',
        this.MediaController.updateAvatar);
  }

  
}