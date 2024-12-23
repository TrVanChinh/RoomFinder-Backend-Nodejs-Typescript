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
      
      const address = await this.AddressService.getOneAddress(req.params.id);
      res.status(200).json(address);
    } catch (error) {
      next(error);
    }
  };

  public getaddress = async (req: Request, res: Response, next: NextFunction) => {
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

  public updateAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: IAddress = req.body
      const result = await this.AddressService.updateAddress(data)
      res.status(200).json({ message: 'Cập nhật địa chỉ phòng thành công.',});
    } catch (error) {
      next(error);
    }
  }

  public deleteAddress = async (req: Request, res: Response, next: NextFunction) => { 
    try {
      const maDiaChi = req.params.id;
      const result = await this.AddressService.deleteAddress(maDiaChi)
      res.status(200).json({ message: 'Xóa địa chỉ thành công.',});
    } catch (error) {
      next(error);
    }
  }
}

