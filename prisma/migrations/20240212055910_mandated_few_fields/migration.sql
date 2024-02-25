/*
  Warnings:

  - Made the column `category` on table `CardTransaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category` on table `Receipt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `from` on table `Receipt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total` on table `Receipt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity` on table `ReceiptItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `amount` on table `ReceiptItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CardTransaction" ALTER COLUMN "category" SET NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "category" SET NOT NULL;

-- AlterTable
ALTER TABLE "Receipt" ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "from" SET NOT NULL,
ALTER COLUMN "total" SET NOT NULL;

-- AlterTable
ALTER TABLE "ReceiptItem" ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "amount" SET NOT NULL;
