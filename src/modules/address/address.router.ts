// import RegisterDto from './dtos/register.dtos';
import { Route } from '../../core/interfaces';
import { Router } from 'express';
import AddressController from './address.controller';
import { authMiddleware } from '../../core/middlewave';
import multer from "multer";
// import validationMiddleware from '@core/middleware/validation.middleware';

export default class AddressRoute implements Route {
  public path = '/api/address';
  public router = Router();
  public AddressController = new AddressController();
  public upload = multer({ dest: '../../uploads/' });

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.get(
      this.path,
      this.AddressController.getRoomType);

    this.router.post(
      this.path + '/addNew',
      this.AddressController.addAddress);


  }
}