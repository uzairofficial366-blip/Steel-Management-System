import { Role } from "@prisma/client";
import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { AppError, asyncHandler } from "../utils/errors.js";

export const customersRouter = Router();
customersRouter.use(authenticate);

customersRouter.get(
  "/",
  authorize(Role.ADMIN, Role.MANAGER, Role.SALESMAN, Role.ACCOUNTANT),
  asyncHandler(async (_req, res) => {
    const customers = await prisma.customer.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ customers });
  }),
);

customersRouter.post(
  "/",
  authorize(Role.ADMIN, Role.MANAGER, Role.SALESMAN),
  asyncHandler(async (req, res) => {
    const { name, phone, address, openingBalance } = req.body;
    if (!name || !phone) throw new AppError(400, "Name and phone are required");
    const customer = await prisma.customer.create({
      data: { name, phone, address: address || "", openingBalance: Number(openingBalance || 0) },
    });
    res.status(201).json({ customer });
  }),
);

customersRouter.put(
  "/:id",
  authorize(Role.ADMIN, Role.MANAGER, Role.SALESMAN),
  asyncHandler(async (req, res) => {
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        openingBalance: Number(req.body.openingBalance || 0),
      },
    });
    res.json({ customer });
  }),
);

customersRouter.delete(
  "/:id",
  authorize(Role.ADMIN, Role.MANAGER),
  asyncHandler(async (req, res) => {
    await prisma.customer.delete({ where: { id: req.params.id } });
    res.status(204).send();
  }),
);
