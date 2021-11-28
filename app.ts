import express from "express";
import cookieParser from "cookie-parser";

const app = express();
import userRouter from "./routes/userRoutes";
import searchRouter from "./routes/newsRoutes";
import errorHandler from "./controllers/errorController";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/news", searchRouter);
app.use(errorHandler);

export default app;
