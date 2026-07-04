-- CreateEnum
CREATE TYPE "LogStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "AIReviewLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "inputSummary" JSONB NOT NULL,
    "outputSummary" JSONB,
    "status" "LogStatus" NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIReviewLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIReviewLog_userId_idx" ON "AIReviewLog"("userId");

-- AddForeignKey
ALTER TABLE "AIReviewLog" ADD CONSTRAINT "AIReviewLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
