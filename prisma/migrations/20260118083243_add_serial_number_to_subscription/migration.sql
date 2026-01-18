-- AlterTable
ALTER TABLE "IpoSubscription" ADD COLUMN     "serialNumber" TEXT;

-- CreateIndex
CREATE INDEX "IpoSubscription_symbol_serialNumber_idx" ON "IpoSubscription"("symbol", "serialNumber");
