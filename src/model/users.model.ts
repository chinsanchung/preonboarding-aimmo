import { Schema, model } from "mongoose";

interface IUser {
  email: string;
  password: string;
  name: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

const schema = new Schema<IUser>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date },
  deleted_at: { type: Date },
});

const UserModel = model<IUser>("users", schema);

export { UserModel, IUser };
