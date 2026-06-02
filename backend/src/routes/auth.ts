import bcrypt from "bcryptjs";
import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { publicUser, signToken } from "../utils/auth.js";
import { AppError, asyncHandler } from "../utils/errors.js";

export const authRouter = Router();

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { userId, password } = req.body as { userId?: string; password?: string };
    const normalizedUserId = userId?.trim();
    const normalizedPassword = password?.trim();
    if (!normalizedUserId || !normalizedPassword) throw new AppError(400, "User ID and password are required");

    const user = await prisma.user.findUnique({ where: { userId: normalizedUserId } });
    if (!user || !user.isActive) throw new AppError(401, "Invalid credentials");

    const ok = await bcrypt.compare(normalizedPassword, user.passwordHash);
    if (!ok) throw new AppError(401, "Invalid credentials");

    res.json({ token: signToken(user), user: publicUser(user) });
  }),
);

authRouter.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) throw new AppError(404, "User not found");
    res.json({ user: publicUser(user) });
  }),
);
