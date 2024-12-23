// import RegisterDto from './dtos/register.dtos';
import { Route } from '../../core/interfaces';
import { Router } from 'express';
import DepositController from './deposit.controller';
import { authMiddleware } from '../../core/middlewave';
import multer from "multer";
// import validationMiddleware from '@core/middleware/validation.middleware';

export default class DepositsRoute implements Route {
  public path = '/api/deposit';
  public router = Router();
  public DepositController = new DepositController();
  public upload = multer({ dest: '../../uploads/' });

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.get(
      this.path ,
      this.DepositController.getDeposit);

    this.router.get(
      this.path + '/room/:id',
      this.DepositController.getDepositByRoom);
  

    this.router.post(
      this.path + '/addNew',
      this.DepositController.addDeposit);

    this.router.post(
      this.path + '/addANewOne',
      this.DepositController.addOneDeposit);

    this.router.put(
      this.path + '/update/:id',
      this.DepositController.updateDeposit);
    
    this.router.delete(
      this.path + '/delete/:id',
      this.DepositController.deleteDeposit);

  }
}