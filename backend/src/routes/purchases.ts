import { PaymentStatus, Role } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { AppError, asyncHandler } from "../utils/errors.js";

export const purchasesRouter = Router();
purchasesRouter.use(authenticate);

const purchaseItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  purchasePrice: z.coerce.number().positive(),
});

const createPurchaseSchema = z.object({
  supplierId: z.string().min(1),
  paidAmount: z.coerce.number().min(0).default(0),
  items: z.array(purchaseItemSchema).min(1),
});

const purchaseInclude = {
  supplier: true,
  user: true,
  items: { include: { product: true } },
};

purchasesRouter.post(
  "/",
  authorize(Role.ADMIN, Role.MANAGER),
  asyncHandler(async (req, res) => {
    const parsed = createPurchaseSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(400, parsed.error.issues[0]?.message || "Invalid purchase data");

    const { supplierId, paidAmount, items } = parsed.data;

    const purchase = await prisma.$transaction(async (tx) => {
      const supplier = await tx.supplier.findUnique({ where: { id: supplierId } });
      if (!supplier) throw new AppError(404, "Supplier not found");

      const products = await tx.product.findMany({
        where: { id: { in: items.map((item) => item.productId) } },
      });
      const productMap = new Map(products.map((product) => [product.id, product]));
      let totalAmount = 0;

      const purchaseItems = items.map((item) => {
        const product = productMap.get(item.productId);
        if (!product) throw new AppError(404, "Product not found");

        const quantity = Number(item.quantity);
        const price = Number(item.purchasePrice);
        const subtotal = quantity * price;
        totalAmount += subtotal;
        return { productId: item.productId, quantity, price, subtotal };
      });

      if (paidAmount > totalAmount) throw new AppError(400, "Paid amount cannot exceed total amount");

      const remainingAmount = totalAmount - paidAmount;
      const paymentStatus =
        remainingAmount <= 0 ? PaymentStatus.PAID : paidAmount > 0 ? PaymentStatus.PARTIAL : PaymentStatus.DUE;
      const invoiceNumber = `PUR-${Date.now()}`;

      const createdPurchase = await tx.purchase.create({
        data: {
          invoiceNumber,
          supplierId,
          userId: req.user!.id,
          totalAmount,
          paidAmount,
          remainingAmount,
          paymentStatus,
          items: { create: purchaseItems },
        },
        include: purchaseInclude,
      });

      for (const item of purchaseItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: { increment: item.quantity },
            purchasePrice: item.price,
          },
        });
      }

      if (remainingAmount > 0) {
        await tx.supplierKhataEntry.create({
          data: {
            supplierId,
            type: "DEBIT",
            amount: remainingAmount,
            description: `Remaining amount for ${invoiceNumber}`,
          },
        });
      }

      return createdPurchase;
    });

    res.status(201).json({ purchase });
  }),
);

purchasesRouter.get(
  "/",
  authorize(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT),
  asyncHandler(async (_req, res) => {
    const purchases = await prisma.purchase.findMany({
      include: purchaseInclude,
      orderBy: { createdAt: "desc" },
    });
    res.json({ purchases });
  }),
);

purchasesRouter.get(
  "/supplier/:supplierId",
  authorize(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT),
  asyncHandler(async (req, res) => {
    const purchases = await prisma.purchase.findMany({
      where: { supplierId: req.params.supplierId },
      include: purchaseInclude,
      orderBy: { createdAt: "desc" },
    });
    res.json({ purchases });
  }),
);

purchasesRouter.get(
  "/:id",
  authorize(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT),
  asyncHandler(async (req, res) => {
    const purchase = await prisma.purchase.findUnique({
      where: { id: req.params.id },
      include: purchaseInclude,
    });
    if (!purchase) throw new AppError(404, "Purchase not found");
    res.json({ purchase });
  }),
);
