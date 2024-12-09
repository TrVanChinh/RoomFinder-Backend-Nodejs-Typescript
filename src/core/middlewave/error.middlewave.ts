import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions';// Đường dẫn tệp HttpException của bạn

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500; // Nếu không có status thì mặc định là 500
  const message = error.message || 'Lỗi máy chủ';
  res.status(status).json({ status: 'FAILED', message });
};

export default errorMiddleware;
