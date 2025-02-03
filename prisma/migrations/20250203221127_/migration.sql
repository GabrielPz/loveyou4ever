/*
  Warnings:

  - You are about to drop the column `amount` on the `payments` table. All the data in the column will be lost.
  - The `status` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymenStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "amount",
DROP COLUMN "status",
ADD COLUMN     "status" "PaymenStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "relationhips" ADD COLUMN     "status" "PaymenStatus" NOT NULL DEFAULT 'PENDING';
