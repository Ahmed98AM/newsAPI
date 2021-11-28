import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import User from "../models/userModel";
import { Request, Response, NextFunction } from "express";

exports.getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const doc = await User.find({});
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        doc,
      },
    });
  }
);

exports.getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let foundUser = User.findById(req.params.id);
    const doc = await foundUser;
    if (!doc) {
      return next(new AppError("no User found with that id!", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  }
);
exports.updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const doc = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError("no user found with that id!", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  }
);
exports.deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const doc = await User.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("no User found with that id!", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
