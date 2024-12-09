import { Route } from '../../core/interfaces';
import { Router } from 'express';
import RoleController from './role.controller';
import { authMiddleware } from '../../core/middlewave';

export default class RoleRoute implements Route {
    public path = '/api/role';
    public router = Router();
    public RoleController = new RoleController();
  
    constructor() {
      this.initializeRoutes();
    }
  
    private initializeRoutes() { 
        this.router.get(this.path, this.RoleController.getRoleAll);

    }
}