import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import {
  IOutput,
  IOutputWithData,
} from '../common/interfaces/output.interface';
import { IUser, UserModel } from '../model/users.model';

dotenv.config();

export class UserService {
  public async findUserByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({
      email,
    }).lean();
  }

  public async signup({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }): Promise<IOutput> {
    try {
      const existUser = await UserModel.findOne({ email }).lean();
      if (existUser) {
        return {
          ok: false,
          httpStatus: 400,
          error: '이미 가입되어 있는 이메일 입니다.',
        };
      }
      const hashPassword = await bcrypt.hash(password, 10);
      await UserModel.create({
        email,
        password: hashPassword,
        name,
        created_at: Date.now(),
      });

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        httpStatus: 500,
        error: '회원 가입 과정에서 에러가 발생했습니다.',
      };
    }
  }

  public async signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<IOutputWithData<string>> {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return {
          ok: false,
          httpStatus: 400,
          error: '존재하지 않는 아이디입니다.',
        };
      }
      const isCorrectPassword = await bcrypt.compare(password, user.password);
      if (!isCorrectPassword) {
        return {
          ok: false,
          httpStatus: 400,
          error: '비밀번호가 일치하지 않습니다.',
        };
      }
      const accessToken = jwt.sign(
        { email: user.email, name: user.name },
        process.env.JWT_SECRET!,
        { expiresIn: '1day' }
      );
      return { ok: true, data: accessToken };
    } catch (error) {
      return {
        ok: false,
        httpStatus: 500,
        error: '로그인 과정에서 에러가 발생했습니다.',
      };
    }
  }
}
