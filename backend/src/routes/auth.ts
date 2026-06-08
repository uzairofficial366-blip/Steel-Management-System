import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { publicUser, signToken } from "../utils/auth.js";
import { AppError, asyncHandler } from "../utils/errors.js";

export const authRouter = Router();

const loginSchema = z
  .object({
    userId: z.string().optional(),
    userID: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
  })
  .transform((body) => ({
    userId: (body.userId ?? body.userID ?? body.username ?? "").trim(),
    password: (body.password ?? "").trim(),
  }))
  .refine((body) => body.userId.length > 0 && body.password.length > 0, {
    message: "User ID and password are required",
  });

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(400, parsed.error.issues[0]?.message || "User ID and password are required");

    const user = await prisma.user.findUnique({ where: { userId: parsed.data.userId } });
    if (!user || !user.isActive) throw new AppError(401, "Invalid credentials");

    const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
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
