-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('IDR');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "SubscriptionCategory" AS ENUM ('ENTERTAINMENT', 'WORK_TOOLS', 'FAMILY', 'EDUCATION', 'CLOUD', 'TELCO', 'AI_TOOLS', 'OTHER');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'TRIAL', 'PENDING_CANCELLATION', 'CANCELLED');

-- CreateEnum
CREATE TYPE "UsageFrequency" AS ENUM ('OFTEN', 'SOMETIMES', 'RARELY', 'NOT_SURE');

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'IDR',
    "billingCycle" "BillingCycle" NOT NULL,
    "nextBillingDate" DATE NOT NULL,
    "category" "SubscriptionCategory" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "paymentMethod" TEXT,
    "usageFrequency" "UsageFrequency" NOT NULL,
    "isCancellationCandidate" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_userId_status_idx" ON "Subscription"("userId", "status");

-- CreateIndex
CREATE INDEX "Subscription_userId_nextBillingDate_idx" ON "Subscription"("userId", "nextBillingDate");

-- CreateIndex
CREATE INDEX "Subscription_userId_category_idx" ON "Subscription"("userId", "category");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
