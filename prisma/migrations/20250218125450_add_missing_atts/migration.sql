/*
  Warnings:

  - Added the required column `relationshipDate` to the `relationhips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relationshipName` to the `relationhips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "relationhips" ADD COLUMN     "relationshipDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "relationshipName" TEXT NOT NULL;
