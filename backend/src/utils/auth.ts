import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import { env } from "../config/env.js";

export function publicUser(user: Pick<User, "id" | "userId" | "name" | "role" | "customerId" | "isActive">) {
  return {
    id: user.id,
    userId: user.userId,
    name: user.name,
    role: user.role,
    customerId: user.customerId,
    isActive: user.isActive,
  };
}

export function signToken(user: Pick<User, "id" | "userId" | "role" | "customerId">) {
  return jwt.sign(
    {
      sub: user.id,
      userId: user.userId,
      role: user.role,
      customerId: user.customerId,
    },
    env.jwtSecret,
    { expiresIn: "7d" },
  );
}
