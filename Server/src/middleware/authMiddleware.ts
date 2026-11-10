import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      res.status(401).json({
        message: "Token missing",
      });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET is missing");
      res.status(500).json({
        message: "Internal server error",
      });
      return;
    }

    const payload = jwt.verify(token, secret);

    if (
      typeof payload === "string" ||
      typeof payload.id !== "string"
    ) {
      res.status(401).json({
        message: "Invalid token payload",
      });
      return;
    }

    req.userId = payload.id;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
