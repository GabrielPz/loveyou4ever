/*
  Warnings:

  - You are about to drop the column `userId` on the `relationhips` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "relationhips" DROP CONSTRAINT "relationhips_userId_fkey";

-- AlterTable
ALTER TABLE "relationhips" DROP COLUMN "userId";
