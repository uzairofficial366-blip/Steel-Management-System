import { Role } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { AppError, asyncHandler } from "../utils/errors.js";

export const settingsRouter = Router();
settingsRouter.use(authenticate);

const defaults = {
  shopName: "Smart Shop",
  invoicePrefix: "INV",
  currency: "PKR",
  lowStockNotification: "Enabled",
};

const settingsSchema = z.object({
  shopName: z.string().trim().min(1),
  invoicePrefix: z.string().trim().min(1),
  currency: z.string().trim().min(1),
  lowStockNotification: z.string().trim().min(1),
});

settingsRouter.get(
  "/",
  authorize(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT),
  asyncHandler(async (_req, res) => {
    const rows = await prisma.setting.findMany();
    const settings = rows.reduce<Record<string, string>>(
      (acc, row) => ({ ...acc, [row.key]: row.value }),
      { ...defaults },
    );
    res.json({ settings });
  }),
);

settingsRouter.put(
  "/",
  authorize(Role.ADMIN),
  asyncHandler(async (req, res) => {
    const parsed = settingsSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(400, parsed.error.issues[0]?.message || "Invalid settings");

    await prisma.$transaction(
      Object.entries(parsed.data).map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          create: { key, value },
          update: { value },
        }),
      ),
    );

    res.json({ settings: parsed.data });
  }),
);
