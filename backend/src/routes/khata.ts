import { Role } from "@prisma/client";
import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { AppError, asyncHandler } from "../utils/errors.js";

export const khataRouter = Router();
khataRouter.use(authenticate);

khataRouter.get(
  "/customer/:customerId",
  authorize(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.CUSTOMER),
  asyncHandler(async (req, res) => {
    if (req.user!.role === Role.CUSTOMER && req.params.customerId !== req.user!.customerId) {
      throw new AppError(403, "You can only view your own khata");
    }
    const entries = await prisma.khataEntry.findMany({
      where: { customerId: req.params.customerId },
      orderBy: { createdAt: "desc" },
    });
    const balance = entries.reduce(
      (sum, entry) => sum + (entry.type === "DEBIT" ? Number(entry.amount) : -Number(entry.amount)),
      0,
    );
    res.json({ entries, balance });
  }),
);

khataRouter.post(
  "/",
  authorize(Role.ADMIN, Role.ACCOUNTANT),
  asyncHandler(async (req, res) => {
    const { customerId, type, amount, description } = req.body;
    if (!customerId || !type || !amount) throw new AppError(400, "Customer, type, and amount are required");
    const entry = await prisma.khataEntry.create({
      data: { customerId, type, amount: Number(amount), description: description || "" },
    });
    res.status(201).json({ entry });
  }),
);
