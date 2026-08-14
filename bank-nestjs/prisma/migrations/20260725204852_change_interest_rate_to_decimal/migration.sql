/*
  Warnings:

  - You are about to drop the column `term_monts` on the `credits` table. All the data in the column will be lost.
  - Added the required column `term_months` to the `credits` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `interest_rate` on the `credits` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "credits" DROP COLUMN "term_monts",
ADD COLUMN     "term_months" INTEGER NOT NULL,
DROP COLUMN "interest_rate",
ADD COLUMN     "interest_rate" DECIMAL(65,30) NOT NULL;
