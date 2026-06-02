import { PaymentStatus, Role } from "@prisma/client";
import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { AppError, asyncHandler } from "../utils/errors.js";

export const salesRouter = Router();
salesRouter.use(authenticate);

salesRouter.get(
  "/",
  authorize(Role.ADMIN, Role.MANAGER, Role.SALESMAN, Role.ACCOUNTANT, Role.CUSTOMER),
  asyncHandler(async (req, res) => {
    const where = req.user!.role === Role.CUSTOMER ? { customerId: req.user!.customerId || "" } : {};
    const sales = await prisma.sale.findMany({
      where,
      include: { customer: true, user: true, items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ sales });
  }),
);

salesRouter.post(
  "/",
  authorize(Role.ADMIN, Role.MANAGER, Role.SALESMAN),
  asyncHandler(async (req, res) => {
    const { customerId, paidAmount = 0, items = [] } = req.body as {
      customerId?: string;
      paidAmount?: number;
      items?: { productId: string; quantity: number; price?: number }[];
    };
    if (!customerId || !items.length) throw new AppError(400, "Customer and items are required");

    const sale = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: items.map((item) => item.productId) } },
      });
      const productMap = new Map(products.map((product) => [product.id, product]));
      let totalAmount = 0;

      const saleItems = items.map((item) => {
        const product = productMap.get(item.productId);
        if (!product) throw new AppError(404, "Product not found");
        if (product.quantity < Number(item.quantity)) {
          throw new AppError(400, `${product.name} does not have enough stock`);
        }
        const price = Number(item.price ?? product.salePrice);
        const quantity = Number(item.quantity);
        const subtotal = price * quantity;
        totalAmount += subtotal;
        return { productId: item.productId, quantity, price, subtotal };
      });

      const remainingAmount = totalAmount - Number(paidAmount);
      const paymentStatus =
        remainingAmount <= 0 ? PaymentStatus.PAID : Number(paidAmount) > 0 ? PaymentStatus.PARTIAL : PaymentStatus.DUE;
      const invoiceNumber = `INV-${Date.now()}`;

      const createdSale = await tx.sale.create({
        data: {
          invoiceNumber,
          customerId,
          userId: req.user!.id,
          totalAmount,
          paidAmount: Number(paidAmount),
          remainingAmount,
          paymentStatus,
          items: { create: saleItems },
        },
        include: { customer: true, user: true, items: { include: { product: true } } },
      });

      for (const item of saleItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      if (remainingAmount > 0) {
        await tx.khataEntry.create({
          data: {
            customerId,
            type: "DEBIT",
            amount: remainingAmount,
            description: `Remaining amount for ${invoiceNumber}`,
          },
        });
      }

      return createdSale;
    });

    res.status(201).json({ sale });
  }),
);

salesRouter.get(
  "/:id",
  authorize(Role.ADMIN, Role.MANAGER, Role.SALESMAN, Role.ACCOUNTANT, Role.CUSTOMER),
  asyncHandler(async (req, res) => {
    const sale = await prisma.sale.findUnique({
      where: { id: req.params.id },
      include: { customer: true, user: true, items: { include: { product: true } } },
    });
    if (!sale) throw new AppError(404, "Sale not found");
    if (req.user!.role === Role.CUSTOMER && sale.customerId !== req.user!.customerId) {
      throw new AppError(403, "You can only view your own invoices");
    }
    res.json({ sale });
  }),
);
