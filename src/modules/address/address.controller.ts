import { NextFunction, Request, Response } from 'express';

// import RegisterDto from './dtos/register.dtos';
import AddressService from './address.servicer';
import { console } from 'inspector';
import { uploadToCloudinary } from '../../config/cloudinary';
import IAddress from './address.interface';
// import { OTPData } from './users.interface';

export default class AddressController {
  private AddressService = new AddressService();

  public getRoomType = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const address = await this.AddressService.getAddress();
      res.status(200).json(address);
    } catch (error) {
      next(error);
    }
  };
  public addAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: IAddress = req.body
      const result = await this.AddressService.addAddress(data)
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

