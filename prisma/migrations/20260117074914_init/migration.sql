-- CreateTable
CREATE TABLE "IpoDetails" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "fieldValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IpoDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IpoSubscription" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subscriptionRatio" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IpoSubscription_pkey" PRIMARY KEY ("id")
);
