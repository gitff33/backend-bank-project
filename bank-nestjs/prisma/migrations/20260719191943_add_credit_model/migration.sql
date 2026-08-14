-- CreateEnum
CREATE TYPE "StatusCredit" AS ENUM ('PENDING', 'ACTIVE', 'PAID', 'OVERDUE');

-- CreateTable
CREATE TABLE "credits" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "interest_rate" TEXT NOT NULL,
    "term_monts" INTEGER NOT NULL,
    "status" "StatusCredit" NOT NULL DEFAULT 'PENDING',
    "account_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credits_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "credits" ADD CONSTRAINT "credits_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
