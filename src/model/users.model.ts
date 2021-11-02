import { Schema, model } from "mongoose";

interface IUser {
  email: string;
  password: string;
  name: string;
  created_at: Date | number;
  updated_at?: Date | number;
  deleted_at?: Date;
}

const schema = new Schema<IUser>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date },
});

const UserModel = model<IUser>("users", schema);

export { UserModel, IUser };
