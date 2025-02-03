/*
  Warnings:

  - Added the required column `description` to the `relationhips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "relationhips" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "videoLink" TEXT;
