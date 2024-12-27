import RegisterDto from './dtos/register.dtos';
import { Route } from '../../core/interfaces';
import { Router } from 'express';
import UsersController from './users.controller';
import { authMiddleware } from '../../core/middlewave';
import multer from "multer";
// import validationMiddleware from '@core/middleware/validation.middleware';

export default class UsersRoute implements Route {
  public path = '/api/v1/users';
  public router = Router();
  public usersController = new UsersController();
  public upload = multer({ dest: '../../uploads/' });

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    
    this.router.post(this.path, this.usersController.register);
    this.router.post(this.path+ '/checkInfo', this.usersController.checkRegistrationInfomation);

    this.router.post(this.path+ '/roomOwner', this.usersController.registerRoomOwner);

    this.router.post(this.path+ '/sendOTP', this.usersController.sendOTPVerificationEmail);

    this.router.post(this.path + '/addUser', this.usersController.addUser);

    this.router.put(
      this.path + '/:id',
      this.usersController.userUpdateByAdmin);

    this.router.get(this.path + '/role', this.usersController.getRoleAll);

    this.router.get(this.path + '/:id', this.usersController.getUserById);

    this.router.get(this.path, this.usersController.getAll);

    this.router.get(this.path + '/paging/:page', this.usersController.getAllPaging);
    
    this.router.get(this.path + '/role/paging/:page', this.usersController.getAllPaginationByRole);

    this.router.delete(this.path + '/:id', this.usersController.deleteUser);
    
    this.router.delete(this.path, this.usersController.deleteUsers);
    
    this.router.post(this.path + '/upload/cccd', this.upload.fields([
      { name: 'matTruocCCCD', maxCount: 1 },
      { name: 'matSauCCCD', maxCount: 1 },
    ]), this.usersController.uploadIDImages);   

    this.router.put(this.path  + '/update/user', this.usersController.userUpdateByUser);
    this.router.put(this.path  + '/updatePassword/:id', this.usersController.updatePassword);
    this.router.post(this.path  + '/payment/zalopay', this.usersController.payment);
    this.router.post(this.path  + '/payment/checkPayment', this.usersController.checkPayment);
    this.router.post(this.path  + '/report', this.usersController.addReport);
















    // this.router.post(this.path, validationMiddleware(RegisterDto, true), this.usersController.register);
    // this.router.put(
    //   this.path + '/:id',
    //   authMiddleware,
    //   validationMiddleware(RegisterDto, true),
    //   this.usersController.updateUser,
    // );

    // this.router.put(
    //   this.path + '/:id',
    //   authMiddleware,
    //   this.usersController.userUpdateByAdmin);

    // this.router.post(this.path, this.usersController.register)

    // this.router.delete(this.path + '/:id', authMiddleware, this.usersController.deleteUser);
    
    // this.router.delete(this.path, authMiddleware, this.usersController.deleteUsers);

    // this.router.put(this.path + '/upload/avatar/:id', this.upload.single('image'), this.usersController.getUserById);

    // this.router.post('/:id', this.upload.fields([
    //   { name: 'matTruocCCCD', maxCount: 1 },
    //   { name: 'matSauCCCD', maxCount: 1 },
    // ]), this.usersController.uploadIDImages);   
  }
}
