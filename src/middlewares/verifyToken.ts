import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface IPayload {
  _id: string;
  iat: number;
  exp: number;
}

export const TokenValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const token = req.header("auth-token");

  const headerAuthorization: string | undefined = req.headers.authorization;

  if (!headerAuthorization || headerAuthorization === undefined) {
    return res.status(403).json({
      success: false,
      error: "No authorization header found! Access denied!"
    });
  }

  const token: string | undefined = headerAuthorization.split(" ")[1];

  if (!token || token === undefined) {
    return res.status(401).json({
      success: false,
      error: "No token found! Access denied!"
    });
  }

  const jwtSecret: string = process.env.JWT_SECRET || "JWT SECRET...";

  try {
    const payload = jwt.verify(token, jwtSecret) as IPayload;
    req.userId = String(payload._id);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: "Invalid token! Access denied!"
    });
  }
};
