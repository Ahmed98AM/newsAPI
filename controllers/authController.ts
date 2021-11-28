import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";

const { promisify } = require("util");
const JWT = require("jsonwebtoken");
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

const signToken = function (id: any) {
  return JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_DURATION,
  });
};

const createSendToken = function (
  user: any,
  statusCode: number,
  res: Response
) {
  user.password = undefined;

  const token = signToken(user._id);
  const JWT_DURATION: any = process.env.JWT_COOKIE_DURATION!;
  const cookieOptions = {
    expires: new Date(Date.now() + JWT_DURATION * 1),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
  return token;
};

export const signUp = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });
  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("email or password is missing !", 400));
  }

  const foundUser = await User.findOne({ email }).select("+password");
  if (
    !foundUser ||
    !(await foundUser.correctPassword(password, foundUser.password))
  ) {
    return next(new AppError("incorrect email or password !", 401));
  }
  await foundUser.save({ validateBeforeSave: false });

  createSendToken(foundUser, 201, res);
});

export const protect = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.jwt !== "anythingToken") {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError("you are not logged in.. please login to get access!", 401)
    );
  }

  let decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user associated with this token does no longer exist!",
        401
      )
    );
  }
  res.locals.user = currentUser;
  next();
});

export const isLoggedIn = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.cookies) {
    try {
      const token = req.cookies.jwt;
      let decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
});
