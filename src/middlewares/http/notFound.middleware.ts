import HttpException from "../../utils/http-exception";
import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const status = error.statusCode || 404;
  const message = error.message || "Resource Not Found!";

  response.status(status).send(message);
};
