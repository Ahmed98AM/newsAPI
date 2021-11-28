import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

const duplicatedDataHandler = (err: any) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate of ${value}. Please again!`;
  return new AppError(message, 400);
};
const tokenExpirationHandler = (err: any) => {
  const message = `Your session has expired please login again`;
  return new AppError(message, 400);
};

const sendError = (err: any, req: Request, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const errorController = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (err.code === 11000) err = duplicatedDataHandler(err);
  if (err.name === "TokenExpiredError" || err.message === "jwt malformed")
    err = tokenExpirationHandler(err);
  sendError(err, req, res);
};

export default errorController;
