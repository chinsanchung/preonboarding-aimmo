import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { validate } from "../utils/joiValidate";
import bcrypt from "bcrypt";
import { UserService } from "./users.service";
import createError from "../utils/createError";
export default class UserController {
  private userService = new UserService();
  constructor() {
    this.signup = this.signup.bind(this);
  }
  async signup(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object()
      .keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
        name: Joi.string().required(),
      })
      .unknown();
    try {
      validate(schema, req.body);
      const { email, name } = req.body;
      let { password } = req.body;
      //회원 가입 중복 체크
      console.log(`userService  : `, this.userService);

      const duplicateEmailCheck = await this.userService.findUserByEmail(email);
      if (duplicateEmailCheck) {
        throw createError(400, "이미 가입되어 있는 이메일 입니다.");
      }
      password = await bcrypt.hash(password, 10);
      return password;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
