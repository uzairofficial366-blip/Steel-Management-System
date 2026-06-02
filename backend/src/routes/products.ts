import { Role } from "@prisma/client";
import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { AppError, asyncHandler } from "../utils/errors.js";

export const productsRouter = Router();
productsRouter.use(authenticate);

productsRouter.get(
  "/",
  authorize(Role.ADMIN, Role.MANAGER, Role.SALESMAN),
  asyncHandler(async (_req, res) => {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ products });
  }),
);

productsRouter.get(
  "/low-stock",
  authorize(Role.ADMIN, Role.MANAGER, Role.SALESMAN),
  asyncHandler(async (_req, res) => {
    const products = await prisma.product.findMany();
    const lowStock = products
      .filter((product) => product.quantity <= product.lowStockLimit)
      .sort((a, b) => b.lowStockLimit - b.quantity - (a.lowStockLimit - a.quantity));

    res.json({ products: lowStock });
  }),
);

productsRouter.post(
  "/",
  authorize(Role.ADMIN, Role.MANAGER),
  asyncHandler(async (req, res) => {
    const { name, category, purchasePrice, salePrice, quantity, lowStockLimit } = req.body;
    if (!name || !category) throw new AppError(400, "Name and category are required");
    const product = await prisma.product.create({
      data: {
        name,
        category,
        purchasePrice: Number(purchasePrice || 0),
        salePrice: Number(salePrice || 0),
        quantity: Number(quantity || 0),
        lowStockLimit: Number(lowStockLimit || 5),
      },
    });
    res.status(201).json({ product });
  }),
);

productsRouter.put(
  "/:id",
  authorize(Role.ADMIN, Role.MANAGER),
  asyncHandler(async (req, res) => {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name: req.body.name,
        category: req.body.category,
        purchasePrice: Number(req.body.purchasePrice),
        salePrice: Number(req.body.salePrice),
        quantity: Number(req.body.quantity),
        lowStockLimit: Number(req.body.lowStockLimit),
      },
    });
    res.json({ product });
  }),
);

productsRouter.delete(
  "/:id",
  authorize(Role.ADMIN, Role.MANAGER),
  asyncHandler(async (req, res) => {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).send();
  }),
);
