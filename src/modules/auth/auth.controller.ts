import { NextFunction, Request, Response } from 'express';

import AuthService from './auth.service';
import LoginDto from './auth.dto';
import { TokenData } from './auth.interface';



export default class AuthController {
  private authService = new AuthService();

  public adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: LoginDto = req.body;
      const tokenData: TokenData = await this.authService.adminLogin(model);
      res.status(200).json(tokenData);
    } catch (error) {
      next(error);
    }
  };

  public userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: LoginDto = req.body.data;
      const user = await this.authService.userLogin(model);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.body.refreshToken;
      const tokenData: TokenData = await this.authService.refreshToken(refreshToken);
      res.status(200).json(tokenData);
    } catch (error) {
      next(error);
    }
  };

  // public revokeToken = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const token = req.body.token;
  //     await this.authService.revokeToken(token);
  //     res.status(200);
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  public getCurrentLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const user = await this.authService.getCurrentLoginUser(userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}