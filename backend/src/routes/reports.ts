import { Role } from "@prisma/client";
import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { asyncHandler } from "../utils/errors.js";

export const reportsRouter = Router();
reportsRouter.use(authenticate);

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function startOfMonth() {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

reportsRouter.get(
  "/dashboard",
  authorize(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT, Role.SALESMAN),
  asyncHandler(async (_req, res) => {
    const [products, todaySalesAgg, monthlySalesAgg, totalCustomers, customerRows, supplierRows, recentInvoices] =
      await Promise.all([
        prisma.product.findMany(),
        prisma.sale.aggregate({ where: { createdAt: { gte: startOfToday() } }, _sum: { totalAmount: true } }),
        prisma.sale.aggregate({ where: { createdAt: { gte: startOfMonth() } }, _sum: { totalAmount: true } }),
        prisma.customer.count(),
        prisma.customer.findMany({ select: { openingBalance: true, khataEntries: true } }),
        prisma.supplier.findMany({ select: { supplierKhataEntries: true } }),
        prisma.sale.findMany({
          include: { customer: true },
          orderBy: { createdAt: "desc" },
          take: 8,
        }),
      ]);
    const customerDues = customerRows.reduce(
      (total, customer) =>
        total +
        customer.khataEntries.reduce(
          (sum, entry) => sum + (entry.type === "DEBIT" ? Number(entry.amount) : -Number(entry.amount)),
          Number(customer.openingBalance),
        ),
      0,
    );
    const supplierDues = supplierRows.reduce(
      (total, supplier) =>
        total +
        supplier.supplierKhataEntries.reduce(
          (sum, entry) => sum + (entry.type === "DEBIT" ? Number(entry.amount) : -Number(entry.amount)),
          0,
        ),
      0,
    );
    const lowStock = products
      .filter((product) => product.quantity <= product.lowStockLimit)
      .sort((a, b) => b.lowStockLimit - b.quantity - (a.lowStockLimit - a.quantity))
      .slice(0, 8);

    res.json({
      totalStock: products.reduce((sum, product) => sum + product.quantity, 0),
      todaySales: Number(todaySalesAgg._sum.totalAmount || 0),
      monthlySales: Number(monthlySalesAgg._sum.totalAmount || 0),
      totalCustomers,
      customerDues,
      supplierDues,
      lowStock,
      recentInvoices,
    });
  }),
);

reportsRouter.get(
  "/sales",
  authorize(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT),
  asyncHandler(async (_req, res) => {
    const sales = await prisma.sale.findMany({
      include: { customer: true, user: true, items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ sales });
  }),
);

reportsRouter.get(
  "/profit-loss",
  authorize(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT),
  asyncHandler(async (_req, res) => {
    const saleItems = await prisma.saleItem.findMany({ include: { product: true } });
    const revenue = saleItems.reduce((sum, item) => sum + Number(item.subtotal), 0);
    const cost = saleItems.reduce((sum, item) => sum + Number(item.product.purchasePrice) * item.quantity, 0);
    const expenses = await prisma.payment.aggregate({ where: { type: "EXPENSE" }, _sum: { amount: true } });
    const expenseTotal = Number(expenses._sum.amount || 0);
    res.json({ revenue, cost, expenses: expenseTotal, profit: revenue - cost - expenseTotal });
  }),
);

reportsRouter.get(
  "/customer-dues",
  authorize(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT),
  asyncHandler(async (_req, res) => {
    const customers = await prisma.customer.findMany({ include: { khataEntries: true } });
    const dues = customers.map((customer) => ({
      customer,
      due: customer.khataEntries.reduce(
        (sum, entry) => sum + (entry.type === "DEBIT" ? Number(entry.amount) : -Number(entry.amount)),
        Number(customer.openingBalance),
      ),
    }));
    res.json({ dues });
  }),
);

reportsRouter.get(
  "/supplier-dues",
  authorize(Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT),
  asyncHandler(async (_req, res) => {
    const suppliers = await prisma.supplier.findMany({ include: { supplierKhataEntries: true } });
    const dues = suppliers.map((supplier) => ({
      supplier,
      due: supplier.supplierKhataEntries.reduce(
        (sum, entry) => sum + (entry.type === "DEBIT" ? Number(entry.amount) : -Number(entry.amount)),
        0,
      ),
    }));
    res.json({ dues });
  }),
);
