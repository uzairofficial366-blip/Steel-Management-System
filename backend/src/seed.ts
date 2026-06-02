import bcrypt from "bcryptjs";
import { PrismaClient, type Role } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();

async function main() {
  const seedPath = path.resolve(process.cwd(), "../db/seed/seed.json");
  const seed = JSON.parse(fs.readFileSync(seedPath, "utf8")) as {
    demoCustomer: { id: string; name: string; phone: string; address: string; openingBalance: number };
    demoUsers: Array<{ userId: string; name: string; password: string; role: string; customerId: string | null }>;
    demoProducts: Array<{ name: string; category: string; purchasePrice: number; salePrice: number; quantity: number; lowStockLimit: number }>;
    demoSuppliers: Array<{ name: string; phone: string; address: string }>;
  };

  const customer = await prisma.customer.upsert({
    where: { id: seed.demoCustomer.id },
    update: seed.demoCustomer,
    create: seed.demoCustomer,
  });

  for (const user of seed.demoUsers) {
    await prisma.user.upsert({
      where: { userId: user.userId },
      update: {
        name: user.name,
        role: user.role as Role,
        customerId: user.customerId === seed.demoCustomer.id ? customer.id : null,
        isActive: true,
        passwordHash: await bcrypt.hash(user.password, 12),
      },
      create: {
        userId: user.userId,
        name: user.name,
        role: user.role as Role,
        customerId: user.customerId === seed.demoCustomer.id ? customer.id : null,
        isActive: true,
        passwordHash: await bcrypt.hash(user.password, 12),
      },
    });
  }

  for (const product of seed.demoProducts) {
    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (!existing) await prisma.product.create({ data: product });
  }

  for (const supplier of seed.demoSuppliers) {
    const existing = await prisma.supplier.findFirst({ where: { name: supplier.name } });
    if (!existing) await prisma.supplier.create({ data: supplier });
  }

  const openingEntry = await prisma.khataEntry.findFirst({
    where: { customerId: customer.id, description: "Opening balance" },
  });
  if (!openingEntry) {
    await prisma.khataEntry.create({
      data: {
        customerId: customer.id,
        type: "DEBIT",
        amount: seed.demoCustomer.openingBalance,
        description: "Opening balance",
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
