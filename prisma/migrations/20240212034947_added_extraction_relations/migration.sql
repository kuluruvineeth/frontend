/*
  Warnings:

  - A unique constraint covering the columns `[extractionId]` on the table `CardStatement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[extractionId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[extractionId]` on the table `Receipt` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "CardStatement" DROP CONSTRAINT "CardStatement_userId_fkey";

-- DropForeignKey
ALTER TABLE "CardTransaction" DROP CONSTRAINT "CardTransaction_cardStatementId_fkey";

-- DropForeignKey
ALTER TABLE "Extraction" DROP CONSTRAINT "Extraction_userId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_userId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceItem" DROP CONSTRAINT "InvoiceItem_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "Receipt" DROP CONSTRAINT "Receipt_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReceiptItem" DROP CONSTRAINT "ReceiptItem_receiptId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "CardStatement_extractionId_key" ON "CardStatement"("extractionId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_extractionId_key" ON "Invoice"("extractionId");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_extractionId_key" ON "Receipt"("extractionId");

-- AddForeignKey
ALTER TABLE "Extraction" ADD CONSTRAINT "Extraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_extractionId_fkey" FOREIGN KEY ("extractionId") REFERENCES "Extraction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptItem" ADD CONSTRAINT "ReceiptItem_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_extractionId_fkey" FOREIGN KEY ("extractionId") REFERENCES "Extraction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardStatement" ADD CONSTRAINT "CardStatement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardStatement" ADD CONSTRAINT "CardStatement_extractionId_fkey" FOREIGN KEY ("extractionId") REFERENCES "Extraction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardTransaction" ADD CONSTRAINT "CardTransaction_cardStatementId_fkey" FOREIGN KEY ("cardStatementId") REFERENCES "CardStatement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
