/*
  Warnings:

  - You are about to drop the column `fieldName` on the `IpoDetails` table. All the data in the column will be lost.
  - You are about to drop the column `fieldValue` on the `IpoDetails` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionRatio` on the `IpoSubscription` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `IpoDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IpoDetails" DROP COLUMN "fieldName",
DROP COLUMN "fieldValue",
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "lastUpdated" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "IpoSubscription" DROP COLUMN "subscriptionRatio",
ADD COLUMN     "applied" DOUBLE PRECISION,
ADD COLUMN     "demand" DOUBLE PRECISION,
ADD COLUMN     "offered" DOUBLE PRECISION,
ADD COLUMN     "times" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "IpoLotDistribution" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "lots" INTEGER,
    "qty" INTEGER,
    "amount" DOUBLE PRECISION,
    "reserved" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IpoLotDistribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IpoApplicationBreakup" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "reserved" INTEGER,
    "applied" INTEGER,
    "times" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IpoApplicationBreakup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IpoLotDistribution_symbol_idx" ON "IpoLotDistribution"("symbol");

-- CreateIndex
CREATE INDEX "IpoApplicationBreakup_symbol_idx" ON "IpoApplicationBreakup"("symbol");

-- CreateIndex
CREATE INDEX "IpoDetails_symbol_idx" ON "IpoDetails"("symbol");

-- CreateIndex
CREATE INDEX "IpoSubscription_symbol_idx" ON "IpoSubscription"("symbol");
