import { Route } from '../../core/interfaces';
import { Router } from 'express';
import InteriorController from './interior.controller';
import { authMiddleware } from '../../core/middlewave';
// import validationMiddleware from '@core/middleware/validation.middleware';

export default class InteriorRoute implements Route {
  public path = '/api/interior';
  public router = Router();
  public InteriorController = new InteriorController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.get(
      this.path,
      this.InteriorController.getInterior);

    this.router.post(
      this.path + '/addNew',
      this.InteriorController.addInterior);

    this.router.put(
      this.path + '/update',
      this.InteriorController.updateInterior);
  }
}