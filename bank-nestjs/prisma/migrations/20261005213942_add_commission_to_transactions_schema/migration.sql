/*
  Warnings:

  - You are about to alter the column `amount` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "commission" DECIMAL(10,2) NOT NULL DEFAULT 0,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);
