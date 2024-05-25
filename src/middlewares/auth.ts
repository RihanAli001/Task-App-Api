import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { secretKey } from "../utils/token";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenHeader: string | undefined = req.header("Authorization");

  if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
    return res.status(400).json({
      err: "Invalid token",
    });
  }

  try {
    const token: string = tokenHeader.split(" ")[1];
    if (token) {
      const decoded: any = jwt.verify(token, secretKey);
      req.userId = decoded?.id;
      next();
    } else {
      return res.status(401).json({
        err: "Invalid token",
      });
    }
  } catch (err: any) {
    return res.status(401).json({
      err: err?.message,
    });
  }
};

export default authenticate;
