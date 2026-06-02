import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { publicUser } from "../utils/auth.js";
import { AppError, asyncHandler } from "../utils/errors.js";

export const usersRouter = Router();
usersRouter.use(authenticate, authorize(Role.ADMIN));

usersRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { customer: true },
    });
    res.json({ users: users.map((user) => ({ ...publicUser(user), customer: user.customer })) });
  }),
);

usersRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { userId, name, password, role, isActive = true, customerId } = req.body;
    if (!userId || !name || !password || !role) throw new AppError(400, "Missing required fields");
    const user = await prisma.user.create({
      data: {
        userId,
        name,
        role,
        isActive: isActive === true || isActive === "true",
        customerId: customerId || null,
        passwordHash: await bcrypt.hash(password, 12),
      },
    });
    res.status(201).json({ user: publicUser(user) });
  }),
);

usersRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { name, role, isActive, customerId } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(role !== undefined ? { role } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
        ...(customerId !== undefined ? { customerId: customerId || null } : {}),
      },
    });
    res.json({ user: publicUser(user) });
  }),
);

usersRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(204).send();
  }),
);

usersRouter.put(
  "/:id/password",
  asyncHandler(async (req, res) => {
    const { password } = req.body;
    if (!password) throw new AppError(400, "Password is required");
    await prisma.user.update({
      where: { id: req.params.id },
      data: { passwordHash: await bcrypt.hash(password, 12) },
    });
    res.json({ message: "Password updated" });
  }),
);
