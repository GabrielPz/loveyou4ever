/*
  Warnings:

  - You are about to drop the column `userId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `accessTill` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `job` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `paid` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `forgotPassword` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `questions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[relationShipId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `relationShipId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Plans" AS ENUM ('BASIC', 'PREMIUM', 'SUPER_PREMIUM');

-- DropForeignKey
ALTER TABLE "forgotPassword" DROP CONSTRAINT "forgotPassword_userId_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_category_id_fkey";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "userId",
ADD COLUMN     "plan" "Plans" NOT NULL DEFAULT 'BASIC',
ADD COLUMN     "relationShipId" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "accessTill",
DROP COLUMN "job",
DROP COLUMN "name",
DROP COLUMN "paid";

-- DropTable
DROP TABLE "categories";

-- DropTable
DROP TABLE "forgotPassword";

-- DropTable
DROP TABLE "questions";

-- DropEnum
DROP TYPE "Job";

-- DropEnum
DROP TYPE "Type";

-- CreateTable
CREATE TABLE "relationhips" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageUrls" TEXT[],
    "timelineContent" TEXT[],
    "paymentId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "relationhips_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_relationShipId_key" ON "payments"("relationShipId");

-- AddForeignKey
ALTER TABLE "relationhips" ADD CONSTRAINT "relationhips_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_relationShipId_fkey" FOREIGN KEY ("relationShipId") REFERENCES "relationhips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
