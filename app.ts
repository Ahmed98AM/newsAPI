import express from "express";
import cookieParser from "cookie-parser";
import errorHandler from "./controllers/errorController";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(errorHandler);

export default app;
