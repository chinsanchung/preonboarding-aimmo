/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { UserModel } from "../model/users.model";
import { jwtConfing } from "../config/config";

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["access_token"];
  if (!token) {
    return res.status(403).json({ message: "로그인이 필요합니다." });
  } else {
    const data = jwt.verify(token, jwtConfing.secretKey) as unknown;

    // @ts-ignore
    const email = data.email;
    const user = await UserModel.findOne({ email }).select("_id").lean();
    // console.log("USER: ", user);
    // @ts-ignore
    req.user = user;
    next();
  }
};

export default verifyUser;
