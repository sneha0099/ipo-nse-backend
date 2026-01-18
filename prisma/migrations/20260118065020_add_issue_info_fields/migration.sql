/*
  Warnings:

  - You are about to drop the column `companyName` on the `IpoDetails` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[symbol]` on the table `IpoDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "IpoDetails" DROP COLUMN "companyName",
ADD COLUMN     "cutOffTime" TEXT,
ADD COLUMN     "discount" TEXT,
ADD COLUMN     "faceValue" TEXT,
ADD COLUMN     "issuePeriod" TEXT,
ADD COLUMN     "issueSize" TEXT,
ADD COLUMN     "issueType" TEXT,
ADD COLUMN     "minInvestment" TEXT,
ADD COLUMN     "priceRange" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "IpoDetails_symbol_key" ON "IpoDetails"("symbol");
