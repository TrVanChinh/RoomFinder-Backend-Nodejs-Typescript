import { NextFunction, Request, Response } from 'express';

// import RegisterDto from './dtos/register.dtos';
import BillService from './bill.service';
import { console } from 'inspector';
import { uploadToCloudinary } from '../../config/cloudinary';
import IBill from './bill.interface';
// import { OTPData } from './users.interface';

export default class BillController {
  private BillService = new BillService();

  public getBillbyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bill = await this.BillService.getBillbyUser(req.params.id)
      res.status(200).json(bill);
    } catch (error) {
      next(error);
    }
  };

  public getBillbyId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bill = await this.BillService.getBillbyId(req.params.id.toString())
      res.status(200).json(bill);
    } catch (error) {
      next(error);
    }
  };

  public getBillforRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bill = await this.BillService.getBillforRoom(req.params.id)
      res.status(200).json(bill);
    } catch (error) {
      next(error);
    }
  };

  public addBill = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: IBill = req.body;
      const result = await this.BillService.addBill(data)
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

}

