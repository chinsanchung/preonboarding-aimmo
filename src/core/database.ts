import mongoose from "mongoose";
import Log from "../utils/debugger";

export default async (mongoUri: any): Promise<boolean> => {
  try {
    await mongoose.connect(mongoUri);
    Log.info("CONNECTED TO MONGO");
    return true;
  } catch (error) {
    Log.info("MONGO START ERROR: ", error);
    return false; // createError 만들기 전에 임시.
  }
};
