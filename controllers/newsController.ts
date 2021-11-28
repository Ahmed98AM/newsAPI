import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import debounce from "../utils/debounceReq";
import fetch from "cross-fetch";
export const getSearchNews = debounce(
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const searchKeyword = req.params.search;
    const foundNews = await fetch(
      `https://newsapi.org/v2/everything?q=${searchKeyword}&apiKey=${process.env.NEWS_API_KEY}`
    );
    const foundNewsJSON = await foundNews.json();
    res.status(201).json({
      status: "success",
      news: foundNewsJSON,
    });
  }),
  500
);
