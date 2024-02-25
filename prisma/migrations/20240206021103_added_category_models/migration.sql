-- CreateTable
CREATE TABLE "Receipt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "extractionId" TEXT NOT NULL,
    "objectPath" TEXT NOT NULL,
    "number" TEXT,
    "category" TEXT,
    "date" TIMESTAMP(3),
    "time" TEXT,
    "from" TEXT,
    "subtotal" DOUBLE PRECISION,
    "tax" DOUBLE PRECISION,
    "tip" DOUBLE PRECISION,
    "total" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceiptItem" (
    "id" TEXT NOT NULL,
    "receiptId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION,
    "amount" DOUBLE PRECISION,

    CONSTRAINT "ReceiptItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "extractionId" TEXT NOT NULL,
    "objectPath" TEXT NOT NULL,
    "invoiceNumber" TEXT,
    "category" TEXT,
    "date" TIMESTAMP(3),
    "fromName" TEXT,
    "fromAddress" TEXT,
    "toName" TEXT,
    "toAddress" TEXT,
    "currency" TEXT,
    "totalAmountDue" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardStatement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "extractionId" TEXT NOT NULL,
    "objectPath" TEXT NOT NULL,
    "issuerName" TEXT NOT NULL,
    "issuerAddress" TEXT,
    "recipientName" TEXT,
    "recipientAddress" TEXT,
    "creditCardName" TEXT,
    "creditCardHolder" TEXT,
    "creditCardNumber" TEXT,
    "date" TIMESTAMP(3),
    "currency" TEXT,
    "totalAmountDue" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardStatement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardTransaction" (
    "id" TEXT NOT NULL,
    "cardStatementId" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "amount" DOUBLE PRECISION,

    CONSTRAINT "CardTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptItem" ADD CONSTRAINT "ReceiptItem_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardStatement" ADD CONSTRAINT "CardStatement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardTransaction" ADD CONSTRAINT "CardTransaction_cardStatementId_fkey" FOREIGN KEY ("cardStatementId") REFERENCES "CardStatement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
