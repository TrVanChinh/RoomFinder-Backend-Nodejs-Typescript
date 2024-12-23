import { NextFunction, Request, Response } from 'express';

// import RegisterDto from './dtos/register.dtos';
import DepositService from './deposit.service';
import { console } from 'inspector';
import { uploadToCloudinary } from '../../config/cloudinary';
import IDeposit from './deposit.interface';
// import { OTPData } from './users.interface';

export default class DepositController {
  private DepositService = new DepositService();

  public getDeposit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deposit = await this.DepositService.getDeposit()
      res.status(200).json(deposit);
    } catch (error) {
      next(error);
    }
  };

  public getDepositByRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deposit = await this.DepositService.getDepositByRoom(req.params.id)
      res.status(200).json(deposit);
    } catch (error) {
      next(error);
    }
  };

  public addOneDeposit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: IDeposit = req.body.data;
      const maPhong: number = req.body.maPhong;
      const result = await this.DepositService.addOneDeposit(maPhong, data)
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public addDeposit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: IDeposit[] = req.body.data;
      const maPhong: number = req.body.maPhong;
      const result = await this.DepositService.addDeposit(maPhong, data)
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public updateDeposit = async (req: Request, res: Response, next: NextFunction) => { 
    try {
      const maPhiDatCoc: string = req.params.id;
      const data: IDeposit = req.body;
      const result = await this.DepositService.updateDeposit(maPhiDatCoc, data)
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public deleteDeposit = async (req: Request, res: Response, next: NextFunction) => { 
    try {
      const maPhiDatCoc: string = req.params.id;
      const result = await this.DepositService.deleteDeposit(maPhiDatCoc)
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

}

