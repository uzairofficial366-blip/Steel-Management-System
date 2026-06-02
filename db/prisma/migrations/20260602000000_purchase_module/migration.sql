-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN "invoiceNumber" TEXT;
ALTER TABLE "Purchase" ADD COLUMN "paymentStatus" "PaymentStatus";

UPDATE "Purchase"
SET
  "invoiceNumber" = 'PUR-' || extract(epoch from "createdAt")::bigint::text || '-' || substr("id", 1, 8),
  "paymentStatus" = CASE
    WHEN "remainingAmount" <= 0 THEN 'PAID'::"PaymentStatus"
    WHEN "paidAmount" > 0 THEN 'PARTIAL'::"PaymentStatus"
    ELSE 'DUE'::"PaymentStatus"
  END
WHERE "invoiceNumber" IS NULL OR "paymentStatus" IS NULL;

ALTER TABLE "Purchase" ALTER COLUMN "invoiceNumber" SET NOT NULL;
ALTER TABLE "Purchase" ALTER COLUMN "paymentStatus" SET NOT NULL;

-- CreateTable
CREATE TABLE "PurchaseItem" (
    "id" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "PurchaseItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierKhataEntry" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "type" "KhataType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupplierKhataEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_invoiceNumber_key" ON "Purchase"("invoiceNumber");

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierKhataEntry" ADD CONSTRAINT "SupplierKhataEntry_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
