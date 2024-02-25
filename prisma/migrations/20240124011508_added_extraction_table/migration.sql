-- CreateEnum
CREATE TYPE "Status" AS ENUM ('TO_RECOGNIZE', 'TO_EXTRACT', 'TO_VERIFY', 'PROCESSED');

-- CreateTable
CREATE TABLE "Extraction" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "objectPath" TEXT NOT NULL,
    "text" TEXT,
    "json" JSONB,
    "userId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'TO_RECOGNIZE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Extraction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Extraction" ADD CONSTRAINT "Extraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
