import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { AppError, asyncHandler } from "../utils/errors.js";

type JwtPayload = {
  sub: string;
  userId: string;
  role: Role;
  customerId?: string | null;
};

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new AppError(401, "Authentication required");
  }

  const token = header.slice(7);
  const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, userId: true, role: true, customerId: true, isActive: true },
  });

  if (!user || !user.isActive) {
    throw new AppError(401, "User is inactive or no longer exists");
  }

  req.user = {
    id: user.id,
    userId: user.userId,
    role: user.role,
    customerId: user.customerId,
  };
  next();
});

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new AppError(403, "You do not have permission for this action"));
      return;
    }
    next();
  };
}
