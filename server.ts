import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";
import { resolve } from "path";

dotenv.config({ path: resolve("./config.env") });
let dbLink = process.env
  .DATABASE_LINK!.replace("<username>", process.env.DATABASE_USERNAME!)
  .replace("<password>", process.env.DATABASE_PASSWORD!)
  .replace("<name>", process.env.DATABASE_NAME!);
mongoose
  .connect(dbLink)
  .then(() => {
    console.log("DB connection Successful!");
  })
  .catch((err) => {
    console.log(err);
  });

const server = app.listen(process.env.PORT, () => {
  console.log("server is running ...");
});
