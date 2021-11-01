import UserModel from "../model/users.model";
export class UserService {
  public async findUserByEmail(email: string): Promise<any | null> {
    return;
  }

  public async signup(
    email: string,
    password: string,
    name: string
  ): Promise<any> {
    return await UserModel.create({
      email,
      password,
      name,
    });
  }
}
