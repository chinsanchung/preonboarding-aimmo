import { Schema, model } from "mongoose";

interface IUser {
  email: string;
  password: string;
  name: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

const schema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    deleted_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const UserModel = model<IUser>("users", schema);

export { UserModel, IUser };
