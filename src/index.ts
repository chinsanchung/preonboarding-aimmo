import app from "./core/app";
import database from "./core/database";
import dotenv from "dotenv";

dotenv.config();

database(process.env.MONGO_URI).then(() => {
  // server
  const options = {
    port: process.env.NODE_PORT || 3000,
  };

  app.listen(options, () => console.log(`server on!!!${options.port}`));
});
