import { Role } from "@prisma/client";
import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { AppError, asyncHandler } from "../utils/errors.js";

export const paymentsRouter = Router();
paymentsRouter.use(authenticate);

paymentsRouter.get(
  "/",
  authorize(Role.ADMIN, Role.ACCOUNTANT, Role.CUSTOMER),
  asyncHandler(async (req, res) => {
    const where = req.user!.role === Role.CUSTOMER ? { customerId: req.user!.customerId || "" } : {};
    const payments = await prisma.payment.findMany({
      where,
      include: { customer: true, supplier: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ payments });
  }),
);

paymentsRouter.post(
  "/",
  authorize(Role.ADMIN, Role.ACCOUNTANT),
  asyncHandler(async (req, res) => {
    const { customerId, supplierId, amount, type, note } = req.body;
    if (!amount || !type) throw new AppError(400, "Amount and type are required");
    const payment = await prisma.$transaction(async (tx) => {
      const createdPayment = await tx.payment.create({
        data: {
          customerId: customerId || null,
          supplierId: supplierId || null,
          amount: Number(amount),
          type,
          note: note || "",
        },
      });

      if (customerId && type === "CUSTOMER_PAYMENT") {
        await tx.khataEntry.create({
          data: { customerId, type: "CREDIT", amount: Number(amount), description: note || "Customer payment" },
        });
      }

      if (supplierId && type === "SUPPLIER_PAYMENT") {
        await tx.supplierKhataEntry.create({
          data: { supplierId, type: "CREDIT", amount: Number(amount), description: note || "Supplier payment" },
        });
      }

      return createdPayment;
    });

    res.status(201).json({ payment });
  }),
);
