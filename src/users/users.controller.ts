import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { validate } from '../utils/joiValidate';
import { UserService } from './users.service';
import createError from '../utils/createError';
import Log from '../utils/debugger';

export default class UserController {
  private userService = new UserService();
  constructor() {
    this.signup = this.signup.bind(this);
    this.signin = this.signin.bind(this);
    this.signout = this.signout.bind(this);
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
    } catch (err) {
      next(err);
      return;
    }
    const { email, password, name } = req.body;
    const result = await this.userService.signup({ email, password, name });
    if (result.ok) {
      return res.status(201).send({ message: '가입이 완료되었습니다.' });
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const error = createError(result.httpStatus!, result.error!);
    next(error);
    return;
  }

  async signin(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object()
      .keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
      })
      .unknown();
    try {
      validate(schema, req.body);
    } catch (err) {
      next(err);
      return;
    }
    const { email, password } = req.body;
    const result = await this.userService.signIn({ email, password });

    if (result.ok) {
      return res
        .status(200)
        .cookie('access_token', result.data, {
          maxAge: 1000 * 60 * 60 * 24 * 1, // 1일간 유지
          httpOnly: true,
        })
        .send({ message: '로그인이 완료되었습니다.' });
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const error = createError(result.httpStatus!, result.error!);
    next(error);
    return;
  }

  async signout(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(204)
        .cookie('access_token', '', {
          maxAge: 0,
        })
        .send();
    } catch (error) {
      Log.error(error);
      next(error);
    }
  }
}
