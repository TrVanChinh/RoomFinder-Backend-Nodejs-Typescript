import { NextFunction, Request, Response } from 'express';
import { console } from 'inspector';
import RoleService from './role.service';

export default class RoleController {
    private RoleService = new RoleService();

    public getRoleAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const roles = await this.RoleService.getRoleAll();
          res.status(200).json(roles);
        } catch (error) {
          next(error);
        }
      };
}