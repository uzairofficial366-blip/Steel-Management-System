import { Role } from "@prisma/client";
import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { AppError, asyncHandler } from "../utils/errors.js";

export const suppliersRouter = Router();
suppliersRouter.use(authenticate, authorize(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT));

suppliersRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const suppliers = await prisma.supplier.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ suppliers });
  }),
);

suppliersRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, phone, address } = req.body;
    if (!name || !phone) throw new AppError(400, "Name and phone are required");
    const supplier = await prisma.supplier.create({ data: { name, phone, address: address || "" } });
    res.status(201).json({ supplier });
  }),
);

suppliersRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const supplier = await prisma.supplier.update({
      where: { id: req.params.id },
      data: { name: req.body.name, phone: req.body.phone, address: req.body.address },
    });
    res.json({ supplier });
  }),
);

suppliersRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.supplier.delete({ where: { id: req.params.id } });
    res.status(204).send();
  }),
);
