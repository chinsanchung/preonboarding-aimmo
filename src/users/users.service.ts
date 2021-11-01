import { IUser, UserModel } from "../model/users.model";
export class UserService {
  public async findUserByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({
      email,
    });
  }

  public async signup(
    email: string,
    password: string,
    name: string
  ): Promise<IUser> {
    return await UserModel.create({
      email,
      password,
      name,
      created_at: Date.now(),
    });
  }
}
