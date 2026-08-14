/*
  Warnings:

  - You are about to drop the column `card_number` on the `accounts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "accounts_card_number_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "card_number";

-- CreateIndex
CREATE UNIQUE INDEX "accounts_user_id_key" ON "accounts"("user_id");
