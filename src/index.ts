import app from "./core/app";
import database from "./core/database";
import dotenv from "dotenv";
import Log from "./utils/debugger";

dotenv.config();

database(process.env.MONGO_URI).then(() => {
  // server
  const options = {
    port: process.env.NODE_PORT || 3000,
  };

  app.listen(options, () => Log.info(`server on!!!${options.port}`));
});
