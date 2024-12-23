import { NextFunction, Request, Response } from 'express';

// import RegisterDto from './dtos/register.dtos';
import InteriorService from './interior.servicer';
import { IInterior } from './interior.interface';
import { console } from 'inspector';

export default class InteriorController {
  private InteriorService = new InteriorService();

  public getInterior = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const address = await this.InteriorService.getInterior();
      res.status(200).json(address);
    } catch (error) {
      next(error);
    }
  };
  public addInterior = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: IInterior = req.body
      const result = await this.InteriorService.addInterior(data)
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public updateInterior = async (req: Request, res: Response, next: NextFunction) => { 
    try {
      const data: IInterior = req.body
      const result = await this.InteriorService.updateInterior(data)
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

