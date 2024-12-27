import { Route } from '../../core/interfaces';
import { Router } from 'express';
import BillController from './bill.controller';
import { authMiddleware } from '../../core/middlewave';
// import validationMiddleware from '@core/middleware/validation.middleware';

export default class BillRoute implements Route {
  public path = '/api/bill';
  public router = Router();
  public BillController = new BillController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.get(
      this.path + '/:id' ,
      this.BillController.getBillbyId);

    this.router.get(
      this.path + '/user/:id' ,
      this.BillController.getBillbyUser);

    this.router.get(
      this.path + '/room/:id',
      this.BillController.getBillforRoom);
  

    this.router.post(
      this.path + '/addNew',
      this.BillController.addBill);

  }
}