/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserModel } from '../model/users.model';
import { jwtConfing } from '../config/config';

const getUserInfoFromToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies['access_token'];
  if (!token) {
    next();
  } else {
    const data = jwt.verify(token, jwtConfing.secretKey) as unknown;

    // @ts-ignore
    const email = data.email;
    const user = await UserModel.findOne({ email }).select('_id').lean();
    // console.log("USER: ", user);
    // @ts-ignore
    req.user = user;
    next();
  }
};

export default getUserInfoFromToken;
