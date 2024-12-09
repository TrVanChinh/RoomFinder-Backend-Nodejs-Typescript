// import { NextFunction, Request, Response, RequestHandler } from 'express';
// import { DataStoredInToken } from '../interfaces/auth.interfaces';
// import jwt from 'jsonwebtoken';

// const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.header('x-auth-token');

//   if (!token) return res.status(401).json({ message: 'No token, authorization denied.' });

//   try {
//     const user = jwt.verify(token, process.env.JWT_TOKEN_SECRET ?? '') as DataStoredInToken;

//     if (!req.user) req.user = { id: 0  };

//     req.user.id = Number(user.id);

//     next();
//   } catch (error) {
//     console.error(`[ERROR] Msg: ${token}`);
//     if (error instanceof Error && error.name === 'TokenExpiredError') {
//       res.status(401).json({ message: 'Token is expired' });
//     } else {
//       res.status(401).json({ message: 'Token is not valid' });
//     }
//   }
// };

// export default authMiddleware;

import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { DataStoredInToken } from '../interfaces/auth.interfaces';

const authMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');

  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied.' });
    return; // Trả về để đảm bảo không có phản hồi nào khác
  }

  try {
    // Xác thực token và gán user ID cho `req.user`
    const user = jwt.verify(token, process.env.JWT_TOKEN_SECRET ?? '') as DataStoredInToken;
    (req as any).user = { id: user.id };
    next(); 
  } catch (error) {
    console.error(`[ERROR] Msg: ${token}`);
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token is expired' });
      return;
    }
    res.status(401).json({ message: 'Token is not valid' });
    return;
  }
};

export default authMiddleware;


